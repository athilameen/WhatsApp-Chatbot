import sessionModel from "../models/session.js";
import {Payload} from "../util/sessions.js"
import { PICKUP_LOCATION_MSG, DROP_LOCATION_MSG } from "../util/constraints.js"
import { messagesCheck, statusCheck, locationCheck, listReplyCheck } from "../util/messageValidation.js";
import {createSession, updateSessionCurrentPath} from "../util/dbHandler.js";
import { sendMarkAsRead, sendLocationRequestingMessage, sendBookTemplateMessage } from "../util/apiHandler.js";

const verify_token = process.env.VERIFY_TOKEN;

//# This is Trigger, when you go to the the Project's BASE_URL
export const checkWebhook = async (req, res) => {
  res.status(200).send("Hello! This is a webhook setup!");
};

//# This is for verifying the Callback URL
//# This will trigger, once you entered - Callback URL and verify_token
//# 1. BASE_URL + webhook = https://www.BASE_URL/webhook
//# 2. verify_token = apple
//# Check the Doc  -
export const vertifyWebhook = async (req, res) => {
  const mode = req.query["hub.mode"];
  const challange = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      res.status(200).send(challange);
    } else {
      res.status(403);
    }
  }
  console.log("hello this is webhook setup");
};

//# This is will trigger, whatevever the changes happens in the Chat
//# All the Bot related Business logic will come here!
export const listenWebhook = async (req, res) => {
  console.log("# Listening Webhook event #");

  const body_param = req.body;
  console.log(JSON.stringify(body_param, null, 2));

  //if(typeof body_param != "undefined"){
  if (body_param.object) {
    //# message's value
    //# to get the Response value from Webhook
    if (messagesCheck(body_param)) {
      console.log("# message event #");

      const phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      const phone_no = body_param.entry[0].changes[0].value.messages[0].from;
      const message_id = body_param.entry[0].changes[0].value.messages[0].id;

      console.log("phone number " + phon_no_id);
      console.log("from " + phone_no);
      console.log("message id  " + message_id);

      //# your business logic starts
      //# find the existing session using current user's phoneNumber
      const existingSession = await sessionModel
        .findOne({ phoneNumber: phone_no })
        .exec();
      //todo - your business logic
      //#your business logic ends

      if(existingSession){
        //old user
        //existing user with the session

        switch(existingSession.currentPath){

          case Payload.PICKUP_LOCATION:

            if(locationCheck(body_param)){

              const latitude=body_param.entry[0].changes[0].value.messages[0].location.latitude;
              const longitude=body_param.entry[0].changes[0].value.messages[0].location.longitude;

              if(await sendLocationRequestingMessage(phone_no, DROP_LOCATION_MSG)){
                console.log("requested drop location");
                updateSessionCurrentPath(existingSession._id, Payload.DROP_LOCATION);
              }

            } else {
              console.log("Expecting user pickup location");
            }

          break;

          case Payload.DROP_LOCATION:
            if(locationCheck(body_param)){

              const latitude=body_param.entry[0].changes[0].value.messages[0].location.latitude;
              const longitude=body_param.entry[0].changes[0].value.messages[0].location.longitude;

              //send list available vehicles
              const listBody = {
                body_text: 'Pick your vehicle',
                footer_text: 'Powered by DE',
                button_text: 'Vehicles List',
              }

              const row1 = {
                id: 1,
                title: "🚘 Car",
                Description: "AED 15 4👤",
              }

              const row2 = {
                id: 2,
                title: "🛺 Tuk",
                Description: "AED 100 3👤",
              }

              const row3 = {
                id: 3,
                title: "🛵 Motor Bike",
                Description: "AED 60  1👤",
              }

              const singleList  = {
                title: "Choose a Vehicle?",
                rows: [row1, row2, row3]
              }

              if(await sendSingleListSelectionMessage(phone_no, listBody, singleList)){
                console.log("Sending single list message Successfully");
                updateSessionCurrentPath(existingSession._id, Payload.VEHICLE_SELECTION);
              }

            } else {
              console.log("Expecting user drop location");
            }
          break;

          case Payload.VEHICLE_SELECTION:
            if(listReplyCheck(body_param)){

              const selectedId=body_param.entry[0].changes[0].value.messages[0].interactive.list_reply.id;
              if(selectedId === "1"){
                console.log('car');
              } else if(selectedId === "2"){
                console.log('tuk');
              } else if(selectedId === "3"){
                console.log('bike');
              }

              if(await sendBookTemplateMessage(phone_no)){
                updateSessionCurrentPath(existingSession._id, Payload.BOOKING_INFO);
              }

            } else{
              console.log("expecting list selection");
            }
          break;

        }

      } else {

        //new user
        if(await sendLocationRequestingMessage(phone_no, PICKUP_LOCATION_MSG)){
          //update the session
          createSession(phone_no)
        }
          
      }

      // for marking read every messages we received
      sendMarkAsRead(message_id);
      //# message's status
      //# SENT | DELIVERED | SEEN
    } else if (statusCheck(body_param)) {
      console.log("# message status event check #");
    }

    res.sendStatus(200);
  } else {
    console.log("# not required webhook event! #");
    res.sendStatus(404);
  }
};

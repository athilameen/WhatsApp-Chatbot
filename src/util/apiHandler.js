import axios from "axios";
import fs from 'fs';
import FormData from 'form-data';


const token=process.env.TOKEN;
const version=process.env.VERSION;
const phone_no_id=process.env.PHONE_NO_ID;


//# This is for sending Text Messages
export async function sendTextMessage(to,msg){
    try {
        // Make the Axios request to send the message
        await axios.post(`https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`, {
            messaging_product: "whatsapp",
            to: to,
            text:{
                body:""+msg
            }
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the request is successful, return true
        return true;
    } catch (error) {
        // If an error occurs, log it and return false
        console.error("Error sending message:", error);
        return false;
    }
}


//# This is for sending Text Messages
export async function sendMarkAsRead(MsgId) {
    try {
        // Make the Axios request to send the message
        // await axios.post(`https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`, {
        //     messaging_product: "whatsapp",
        //     status: "read",
        //     message_id: MsgId
        //     }, {
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // });

        console.log(MsgId);
        console.log("MsgId");
        
        

        const data = {
            "messaging_product": "whatsapp",
            "status": "read",
            "message_id": MsgId
        }

        const response = await axios.post('https://graph.facebook.com/v20.0/395071543694884/messages', data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Response data:', response.data);

        // If the request is successful, return true
        return true;
    } catch (error) {
        // If an error occurs, log it and return false
        console.error("Error sending message:", error);
        return false;
    }
}


//media messages
export async function uploadMediaFile(filePath) {
    const formData = new FormData();
    formData.append('messaging_product', 'whatsapp');
    formData.append('file', fs.createReadStream(filePath));
  
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${version}/${phone_no_id}/media`,
      headers: {
        'Authorization': 'Bearer ' +token,
        'Cookie': 'ps_l=1; ps_n=1',
        'content-type': 'multipart/form-data',
        ...formData.getHeaders()
      },
      data: formData
    };
  
    try {
      const response = await axios.request(config);
      console.log(response.data);
      return response.data;

    } catch (error) {
      console.log(error);
      return error;
    }
}

export async function getMediaURLFromMediaID(mediaId) {
    try {
        const response = await axios.get(`https://graph.facebook.com/${version}/${mediaId}`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
         });

         // Check if the response contains the expected fields
        if ('url' in response.data) {
            return response.data ;
        } else {
            return { error: "Unexpected response format" };
        }

    } catch (error) {
        // If an error occurs, log it and return a structured error response
        console.error("Error getting media link:", error);

        // Type assertion for AxiosError
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || "Media not found" };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}

  //getMediaURLFromMediaURL
export async function downloadMediaFromURL(mediaUrl) {
    try {
  
        const mediaResponse = await axios.get(mediaUrl, {
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
          },
          responseType: 'arraybuffer',
          responseEncoding: 'binary'
  
      });
  
      console.log("data # ",mediaResponse.data);
      return mediaResponse.data;
  
      } catch (error) {
         // If an error occurs, log it and return a server error
         console.error('Error downloadMediaFromURL ', error);
         return error;
      }
}


export async function deleteMediaUsingId(mediaId){
    try {
        const response = await axios.delete(`https://graph.facebook.com/${version}/${mediaId}`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        });

        console.log("data # ", response.data);
        return response.data ;

    } catch (error) {
        // If an error occurs, log it and return a structured error response
        console.error('Error deleting media:', error);

        // Type assertion for AxiosError
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || 'Failed to delete media' };
        } else {
            return { error: 'An unknown error occurred' };
        }
    }
}

 
export async function sendLocationRequestingMessage(to, textMessage) {
    try {
      // Make the Axios request to send the message
      await axios.post(
        `https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`,
        {
          messaging_product: "whatsapp",
          to: to,
          type: "interactive",
          interactive: {
            type: "location_request_message",
            body: {
              text: textMessage,
            },
            action: {
              name: "send_location",
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
   
      // If the request is successful, return true
      return true;
    } catch (error) {
      // If an error occurs, log it and return false
      console.error("Error sending message:", error);
      return false;
    }
  }

  export async function sendSingleListSelectionMessage(to, listBody, singleList) {
    try {
      
      const messageData = {
        messaging_product: "whatsapp",
        to: to,
        type: "interactive",
        interactive: {
          type: "list",
          body: {
            text: listBody.body_text,
          },
          action: {
            button: listBody.button_text,
            sections: [singleList],
          },
        },
      };
   
      // Conditionally add header and footer, because those are optional ones
      if (listBody.header_text) {
        messageData.interactive.header = {
          type: "text",
          text: listBody.header_text,
        };
      }
   
      if (listBody.footer_text) {
        messageData.interactive.footer = {
          text: listBody.footer_text,
        };
      }
   
      // Make the Axios request to send the message
      await axios.post(
        `https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`,
        messageData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
   
      // If the request is successful, return true
      return true;
    } catch (error) {
      // If an error occurs, log it and return false
      console.error("Error sending message:", error);
      return false;
    }
  }

  export async function sendBookTemplateMessage(to) {
    try {
      // Make the Axios request to send the message
      await axios.post(
        `https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`,
        {
          messaging_product: "whatsapp",
          to: to,
          type: "template",
          template: {
            name: "test1", //template name here
            language: {
              code: "en", //template language code here
            },
            components: [
              {
                type: "header",
                parameters: [
                  {
                    type: "image",
                    image: {
                      link: "https://media.licdn.com/dms/image/D560BAQGZTiENqo920w/company-logo_200_200/0/1715492746760/nothing_apps_logo?e=1726099200&v=beta&t=YlcqFyWkM00AjwJvKWOLdxlSJSKLm9vPsJlfffnuGfc"
                    }
                  }
                ]
              },
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: "New Market"
                  },
                  {
                    type: "text",
                    text: "Dubai Shopping Mall"
                  },
                  {
                    type: "text",
                    text: "AED 100"
                  },{
                    type: "text",
                    text: "Dubai 0123"
                  },
                  {
                    type: "text",
                    text: "1:30 pm"
                  }
                ]
              },
              {
                type: "button",
                sub_type: "quick_reply",
                index: "0",
                parameters: [
                  {
                    type: "payload",
                    payload: "cancel"
                  }
                ]
              }
            ],
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
   
      // If the request is successful, return true
      return true;
    } catch (error) {
      // If an error occurs, log it and return false
      console.error("Error sending message:", error);
      return false;
    }
  }
   
   

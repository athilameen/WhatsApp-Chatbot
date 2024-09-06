import mongoose from "mongoose";
import { Payload } from "./sessions.js";
import { deleteCurrentSession } from "./dbHandler.js";

export function sendRespectiveMessage(
  existingSessionId,
  to,
  payload
) {
  switch (payload) {
    case Payload.TIME_OUT:
      console.log("time out");
      deleteCurrentSession(existingSessionId);
      break;
  }

  return true;
}

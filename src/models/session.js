import mongoose from "mongoose";
import { Payload } from "../util/sessions.js";

const sessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  startTime: { type: Date, default: Date.now },
  updatedTime: { type: Date, default: Date.now },
  currentPath: { type: String, required: false, default: Payload.WELCOME },
  isSessionEnd: { type: Boolean, required: false, default: false },
});


export default mongoose.model("Session", sessionSchema);

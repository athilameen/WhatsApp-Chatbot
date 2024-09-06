import app from "./app.js";
import mongoose from "mongoose";
import "dotenv/config";

const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("mongoose connected");
    app.listen(port, () => {
      console.log("server is running on port " + port);
    });
  })
  .catch(() => {
    console.error;
  });

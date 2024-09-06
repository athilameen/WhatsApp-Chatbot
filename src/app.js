import "dotenv/config";
import express from "express";
import notesRoutes from "./routes/notes.js";
import webhookRoutes from "./routes/webhook.js";
import flowRoutes from "./routes/flow.js";
import mediaRoutes from "./routes/media.js";
import stripeRoutes from "./routes/stripe.js";
import body_parser from "body-parser";

const app = express();

app.use((req,res,next) => {
    if (req.originalUrl === "/stripe/webhook") {
      next();
    } else {
      body_parser.json()(req, res, next);
    }
  }
);


app.use("/webhook", webhookRoutes);
app.use("/flow",flowRoutes);
app.use("/media", mediaRoutes);
app.use("/stripe", stripeRoutes);

//to handle any frontend calls
app.use("/api/notes", notesRoutes);


app.use("/", (req, res) => {
  res.status(200).json(`server running on ${process.env.PORT}`);
});

app.use((req, res, next) => {
  next(error("End point not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, next) => {
  console.error("# error start #");
  console.error(error);
  console.error("# error end #");
  let errorMessage = "An unknown error occured";
  if (error) {
    errorMessage = error.message;
    res.status(500).json({ error: errorMessage });
  }
});

export default app;

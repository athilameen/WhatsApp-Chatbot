import express from "express";
import * as NotesController from "../controllers/notes.js";

const router = express.Router();

router.get("/", NotesController.getNotes);

export default router;

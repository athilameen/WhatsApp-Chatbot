import express from "express";
import * as FlowController from "../controllers/flow.js";

const router = express.Router();

router.post("/", FlowController.sendFlows);
router.get("/", FlowController.getFlows);

export default router;

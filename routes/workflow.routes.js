import { Router } from "express";
import { sendReminders } from "../Controllers/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.post( '/subscription/reminder' , sendReminders );

export default workflowRouter;
import { Router } from "express";

import { seeallactiveconsultants, sendContactUsData, viewSingleConsultant } from "../controllers/Globalcontrollers.js";

import { getReview } from "../controllers/ReviewController.js";


const GlobalRouter = Router();

GlobalRouter.route("/globalseeallactiveconsultants").get(
  seeallactiveconsultants
);
GlobalRouter.route("/viewSingleConsultant").post(
  viewSingleConsultant
);

GlobalRouter.route("/getreviewslist").get(getReview);

GlobalRouter.post('/sendContactUsData' , sendContactUsData)

export default GlobalRouter;

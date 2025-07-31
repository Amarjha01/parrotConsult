import { Router } from "express";
import {
  createBooking,
  getBookingsByConsultantId,
  getBookingById
} from "../controllers/Bookingcontroller.js";

const bookingRouter = Router();

bookingRouter.post("/createbooking", createBooking);
bookingRouter.get("/getbookingsviaConsultantid", getBookingsByConsultantId);
bookingRouter.get("/getbooking", getBookingById);

export default bookingRouter;

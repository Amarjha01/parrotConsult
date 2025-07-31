import { Router } from "express";
import { createOrder } from "../controllers/RazorpayController.js";
import { verifyPayment } from "../controllers/PaymentController.js";


const paymentRouter = Router();



paymentRouter.route("/create-order").post(createOrder)

paymentRouter.post("/verifypayment", verifyPayment);

export const PaymentRouter = paymentRouter;
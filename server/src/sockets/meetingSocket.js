// server/src/sockets/meetingSocket.js
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Booking } from "../models/BookingModel.js";
import crypto from 'crypto';
export const webhook = asyncHandler(async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
    const receivedSignature = req.headers["x-razorpay-signature"];
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
  
    if (receivedSignature !== generatedSignature) {
      return res.status(400).send("Invalid webhook signature");
    }
  
    const event = req.body.event;
    const payment = req.body.payload.payment.entity;
  
    if (event === "payment.captured") {
      console.log("✅ Payment Captured:", payment);
  
      // 🟡 Extract Razorpay Order ID
      const razorpayOrderId = payment.order_id;
  
      // 🟢 Now find the corresponding booking
      const booking = await Booking.findOneAndUpdate(
        { razorpay_order_id: razorpayOrderId },
        { status: "scheduled" },
        { new: true }
      ).populate("consultant");
  
      if (!booking) {
        console.warn("⚠️ Booking not found for order_id:", razorpayOrderId);
      } else {
        console.log("✅ Booking auto-confirmed via webhook:", booking._id);
      }
    }
  
    res.status(200).json({ status: "ok" });
  });
  
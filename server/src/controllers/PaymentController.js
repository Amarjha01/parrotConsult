import crypto from "crypto";
import { Booking } from "../models/BookingModel.js"; // adjust path
import { PaymentRecords } from "../models/PaymentRecordModel.js";

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body;
 
  
  try {
    // Step 1: Fetch booking by ID
    const booking = await Booking.findById(bookingId).populate("consultant user");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
// console.log(booking);

    // Step 2: Validate order ID
    if (booking.razorpay_order_id !== razorpay_order_id) {
      return res.status(400).json({ success: false, message: "Order ID mismatch" });
    }


        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature. Payment verification failed.",
      });
    }

    // Step 4: Save payment record
   const payment = await PaymentRecords.create({
      consultant: booking.consultant._id,
      user: booking.user._id,
      amount: booking.consultant.consultantRequest.consultantProfile.sessionFee, 
      currency: "INR",
      status: "successful",
      method: "razorpay",
      transactionId: razorpay_payment_id,
    });

    // Step 5: Mark booking as confirmed
    booking.status = "scheduled";
    booking.payment = payment._id;
    booking.meetingLink = booking.consultant._id+booking.user._id
    await booking.save();
     const consultant = await User.findByIdAndUpdate(
  booking.consultant._id,
  {
    $inc: { 'consultantRequest.consultantProfile.wallet': booking.consultant.consultantRequest.consultantProfile.sessionFee }
  },
  { new: true }
);

      await consultant.save()
    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// server/src/sockets/meetingSocket.js
import { asyncHandler } from "../utils/AsyncHandler.js";
import constants from "constants";
import { User } from "../models/UserModel.js";
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
      // console.log("✅ Payment Captured:", payment);
  
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
        // console.log("✅ Booking auto-confirmed via webhook:", booking._id);
      }
    }
  
    res.status(200).json({ status: "ok" });
  });
  
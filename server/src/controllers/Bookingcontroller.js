// controllers/bookingController.js
import { Booking } from "../models/BookingModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import crypto from "crypto";
import { User } from "../models/UserModel.js";''
import razorpay from "../utils/razorPayInstance.js";
import jwt from "jsonwebtoken";

export const createBooking = asyncHandler(async (req, res) => {
  const { consultantId, userId, datetime, duration, consultationDetail } = req.body;
  //  console.log(consultantId, userId, datetime, duration, consultationDetail);

  const consultant = await User.findById(consultantId);
  if (!consultant) {
    throw new ApiError(404, "Consultant not found");
  }
   const sessionFee = consultant.consultantRequest.consultantProfile.sessionFee



  if (duration == 5 && consultant.videoFreeTrial === false) {
    const booking = await Booking.create({
      consultant: consultantId,
      user: userId,
      bookingDateTime:datetime,
      duration,
      consultationDetail,
      status: "scheduled",
    });

    if (!booking) {
      throw new ApiError(500, "Something went wrong while creating booking");
    }

    consultant.videoFreeTrial = true;
    await consultant.save();

    return res.status(201).json(
      new ApiResponse(201, {
        bookingId: booking._id,
      }, "Booking has been confirmed (free trial)")
    );
  }


  const razorpayOrder = await razorpay.orders.create({
    amount: sessionFee * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    payment_capture: 1,
  });


  const booking = await Booking.create({
    consultant: consultantId,
    user: userId,
    bookingDateTime:datetime,
    duration,
    consultationDetail,
    status: "pending",
    razorpay_order_id: razorpayOrder.id,
  });

  if (!booking) {
    throw new ApiError(500, "Something went wrong while creating booking");
  }

  return res.status(201).json(
    new ApiResponse(201, {
      bookingId: booking._id,
      razorpayOrder,
    }, "Booking and payment order created")
  );
 
});


// get bookings by consultant id

export const getBookingsByConsultantId = asyncHandler(async (req, res) => {
  const cookies = req.cookies.accessToken

 const token =  jwt.verify(cookies , process.env.ACCESS_TOKEN_SECRET)

 const {_id : consultantId } = token
  const bookings = await Booking.find({
    consultant: consultantId,
    status: "scheduled",
  }).populate("user", "fullName profileImage")
    .populate("consultant", "fullName")

    
  console.log('bookings' , bookings);
  
  return res.status(200).json(new ApiResponse(200, bookings));
});

export const getBookingById = asyncHandler(async (req, res) => {
 const cookies = req.cookies.accessToken

 const token =  jwt.verify(cookies , process.env.ACCESS_TOKEN_SECRET)

 const {_id } = token

  const booking = await Booking.find({
   user : _id ,
   status: { $in: ["scheduled", "in-progress", "completed", "cancelled", "missed", "rescheduled"] }
  }).populate("consultant" , "fullName  profileImage");

  console.log(booking);
  

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  
  
  return res.status(200).json(new ApiResponse(200, booking));
});


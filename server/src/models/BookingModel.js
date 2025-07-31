import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingDateTime: { 
      type: Date, 
      required: true 
    },

    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymentsrecord",
      default:null
    },
    razorpay_order_id: { type: String, required: false },
    meetingLink: { type: String },
    status: {
      type: String,
      enum: [
        "pending",
        "scheduled",
        "in-progress",
        "completed",
        "cancelled",
        "missed",
        "rescheduled",
      ],
      default: "pending",
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    duration: { type: Number, required: true },
    consultationDetail: { type: String },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);

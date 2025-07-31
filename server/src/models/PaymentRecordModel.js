import mongoose from "mongoose";

const paymentsRecordSchema = new mongoose.Schema(
  {
    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      required: true,
    },
    method: { type: String },
     transactionId: {
      type: String,
      required: true, 
      unique: true, 
    },
  },
  { timestamps: true }
);

export const paymentRecords = mongoose.model("paymentRecords", paymentsRecordSchema);
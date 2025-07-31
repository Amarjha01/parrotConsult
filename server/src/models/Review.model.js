import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent duplicate review for same session by same user
reviewSchema.index({ session: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);

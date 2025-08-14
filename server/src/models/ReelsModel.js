import mongoose from "mongoose";

const ReelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  URL: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String,
    maxLength: 500
  },
  likes: { 
    type: Number, 
    default: 0 
  },
  comments: [
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
      },
      comment: { 
        type: String,
        required: true,
        maxLength: 200
      },
      date: { 
        type: Date, 
        default: Date.now 
      },
    },
  ],
}, { 
  timestamps: true 
});

// Index for better performance
ReelSchema.index({ createdAt: -1 });
ReelSchema.index({ user: 1 });

export const Reel = mongoose.model("Reel", ReelSchema);
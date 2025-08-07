const ReelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  URL: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  description: { type: String },
  comments: [
    {
      user: { type:mongoose.Schema.Types.ObjectId, ref: "user", required: true },
      comment: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export default mongoose.model("reel", ReelSchema);

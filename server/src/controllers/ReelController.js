import jwt from "jsonwebtoken";
import { Reel } from '../models/ReelsModel.js'; // ✅
import { User } from "../models/UserModel.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/clodinary.js";

// Upload Reel
export const uploadReel = asyncHandler(async (req, res) => {
  console.log('yha call hua hai');
  
  let token = req.cookies?.accessToken;
console.log(token);

if (!token && req.headers.authorization?.startsWith("Bearer ")) {
  token = req.headers.authorization.split(" ")[1];
}

if (!token) {
  return res.status(401).json({ message: 'Unauthorized: No token' });
}


  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const { _id } = decoded;
  const { description } = req.body;

  const reelFile = req.files?.video?.[0];
  if (!reelFile) {
    return res.status(400).json({ message: "Video file is required" });
  }

  const uploadedVideo = await uploadOnCloudinary(reelFile.path, "video");
  if (!uploadedVideo?.url) {
    return res.status(400).json({ message: "Failed to upload video" });
  }

  const newReel = new Reel({
    user: _id,
    URL: uploadedVideo.url,
    description: description || '',
  });

  await newReel.save();
  
  const populatedReel = await Reel.findById(newReel._id)
    .populate('user', 'fullName profileImage')
    .lean();

  return res.status(201).json(
    new ApiResponse(201, populatedReel, 'success', 'Reel uploaded successfully')
  );
});

// Get All Reels (For Feed)
export const getAllReels = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const reels = await Reel.find()
    .populate('user', 'fullName profileImage')
    .populate('comments.user', 'fullName profileImage')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  return res.status(200).json(
    new ApiResponse(200, reels, 'success', 'Reels fetched successfully')
  );
});

// Get User Reels
export const getUserReels = asyncHandler(async (req, res) => {
  const token = req.cookies?.accessToken;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const { _id } = decoded;
  
  const reels = await Reel.find({ user: _id })
    .populate('user', 'fullName profileImage')
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, reels, 'success', 'User reels fetched successfully')
  );
});

// Like Reel
export const likeReel = asyncHandler(async (req, res) => {
  const token = req.cookies?.accessToken;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  const { reelId } = req.params;
  
  const reel = await Reel.findByIdAndUpdate(
    reelId,
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!reel) {
    return res.status(404).json({ message: 'Reel not found' });
  }

  return res.status(200).json(
    new ApiResponse(200, { likes: reel.likes }, 'success', 'Reel liked successfully')
  );
});

// Add Comment
export const addComment = asyncHandler(async (req, res) => {
  const token = req.cookies?.accessToken;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const { _id } = decoded;
  const { reelId } = req.params;
  const { comment } = req.body;

  if (!comment?.trim()) {
    return res.status(400).json({ message: 'Comment is required' });
  }

  const reel = await Reel.findByIdAndUpdate(
    reelId,
    {
      $push: {
        comments: {
          user: _id,
          comment: comment.trim(),
          date: new Date()
        }
      }
    },
    { new: true }
  ).populate('comments.user', 'fullName profileImage');

  if (!reel) {
    return res.status(404).json({ message: 'Reel not found' });
  }

  return res.status(200).json(
    new ApiResponse(200, reel.comments, 'success', 'Comment added successfully')
  );
});

// Delete Reel
export const deleteReel = asyncHandler(async (req, res) => {
  const token = req.cookies?.accessToken;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const { _id } = decoded;
  const { reelId } = req.params;

  const reel = await Reel.findOne({ _id: reelId, user: _id });
  
  if (!reel) {
    return res.status(404).json({ message: 'Reel not found or unauthorized' });
  }

  await Reel.findByIdAndDelete(reelId);

  return res.status(200).json(
    new ApiResponse(200, null, 'success', 'Reel deleted successfully')
  );
});
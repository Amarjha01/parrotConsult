import { Router } from "express";
import {
  uploadReel,
  getAllReels,
  getUserReels,
  likeReel,
  addComment,
  deleteReel
} from "../controllers/ReelController.js";
import {upload } from "../middlewares/multer.js"

const reelRoutes = Router();

// Upload reel
reelRoutes.post("/upload" ,
  upload.fields([{ name: "video", maxCount: 1 }]),
  uploadReel
);

// Get all reels (feed)
reelRoutes.get("/feed" , getAllReels);

// Get user reels
reelRoutes.get("/my-reels" , getUserReels);

// Like reel
reelRoutes.post("/:reelId/like" , likeReel);

// Add comment
reelRoutes.post("/:reelId/comment" , addComment);

// Delete reel
reelRoutes.delete("/:reelId" , deleteReel);

export default reelRoutes;
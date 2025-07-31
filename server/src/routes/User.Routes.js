import { Router } from "express";
import multer from 'multer';
const storage = multer.diskStorage({});
const upload = multer({ storage });
import { aadharVerify, consultantApplication, loginUser, logoutUser, registerUser, seeBooking, updateProfile } from "../controllers/UserController.js";
import {verifyUser} from "../middlewares/UserAuthMiddleware.js";
import { postReview } from "../controllers/ReviewController.js";



const userRouter = Router();
userRouter.route("/registeruser").post(registerUser)
userRouter.route("/loginuser").post(loginUser)
userRouter.route("/logoutuser").post(verifyUser , logoutUser)
userRouter.route("/seebookings").get(verifyUser , seeBooking)
userRouter.route("/postreview").post(verifyUser , postReview)

userRouter.post(
  '/updateProfile',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  updateProfile
);



userRouter.post('/aadharVerify' ,
  upload.fields([
      { name: "aadhaarCard", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
  ]),
    aadharVerify)
userRouter.post('/consultantApplication' ,
    upload.fields([
        { name: "resume", maxCount: 1 },
      ]),
      consultantApplication)



export default userRouter;
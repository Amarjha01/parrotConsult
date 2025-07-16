import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Booking } from "../models/BookingModel.js";
import { User } from "../models/UserModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import genrateAccessTokenAndRefreshToken from "../utils/genrateAccessTokenAndRefreshToken.js";



// register user

export const registerUser = async (req, res) => {
  console.log('api hit');
  
  try {
    const { fullName, phone, password } = req.body;
    console.log(fullName , phone , password);
    
// Check if user already exists
const existingUser = await User.findOne({ phone });
if (existingUser) {
  return res.status(400).json({ message: 'User with this phone number already exists' });
}

// Hash password
const hashedPassword = await bcrypt.hash(password, 12);

// Create and save user
const newUser = new User({
  fullName,
  phone,
  password: hashedPassword
});

await newUser.save();

return res.status(201).json({
  message: 'User registered successfully',
  user: {
    id: newUser._id,
    fullName: newUser.fullName,
    phone: newUser.phone
  }
});
  } catch (error) {
    console.log(error);
    
  }
}

// login user
export const loginUser = asyncHandler(async (req, res) => {
  const { phoneNumber , password , OTPverified } = req.body;
  console.log(phoneNumber);
  
  if (!phoneNumber || !password || OTPverified) {
    throw new ApiError(400, "PhoneNo, Password and OTP verification are required");
  }
const alluser = await User.find()
console.log('all user' , alluser);

  const user = await User.findOne({ phone : phoneNumber });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

const comparePassword = await bcrypt.compare(password , user.password)
if(!comparePassword){
  return res.status(401).json({message:'Please enter valid password'})
}


  const { accessToken, refreshToken } = await genrateAccessTokenAndRefreshToken(
    user._id
  );

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedinUser , 'success' , "User logged in successfully", ));

    // .json(
    //   new ApiResponse(
    //     200,
    //     { user: loggedinUser, accessToken, refreshToken }, // here we are handeling the case where admin wants to set his cokkies him self in his local system may be he wants to login from another device
    //     "user logged in successfully"
    //   )
    // );
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  //clear cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export const seeBooking = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const booking = await Booking.find({
    user: userId,
    status: "scheduled",
  })
    .populate("consultant", "name email profilePicture") // optional
    .sort({ datetime: 1 });

  return res.status(200).json(new ApiResponse(200, booking));
});

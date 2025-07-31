import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Booking } from "../models/BookingModel.js";
import { User } from "../models/UserModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import genrateAccessTokenAndRefreshToken from "../utils/genrateAccessTokenAndRefreshToken.js";
import { uploadOnCloudinary } from "../utils/clodinary.js";



// register user

export const registerUser = async (req, res) => {
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



export const updateProfile = asyncHandler(async (req, res) => {
  console.log('yha call hua hai ');
  
  const token = req.cookies?.accessToken;
  console.log(token);
  
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const { _id } = decoded;
  const body = req.body;

  const resumeFile = req.files?.resume?.[0];
  if (!resumeFile)
    return res.status(400).json({ message: "Resume file is missing" });
  const resume = await uploadOnCloudinary(resumeFile.path, "raw");
  if (!resume?.url)
    return res.status(400).json({ message: "Failed to upload resume" });
  // Base update object
  const updateData = {
    fullName: body.fullName,
    phone: body.phone,
    email: body.email,
    location: body.location,
    profileImage: req.file ? `/uploads/${req.file.filename}` : body.profileImage || '',
  };

  // 🔁 Add consultant nested update only if role is consultant
  if (body.role === 'consultant') {
    updateData.consultantRequest = {
      ...updateData.consultantRequest,
      status: 'pending',
      requestedAt: new Date(),
      consultantProfile: {
        sessionFee: Number(body.sessionFee),
        daysPerWeek: body.daysPerWeek,
        days: body.days?.split(',') || [],
        availableTimePerDay: body.availableTimePerDay,
        qualification: body.qualification,
        fieldOfStudy: body.fieldOfStudy,
        university: body.university,
        graduationYear: Number(body.graduationYear),
        keySkills: body.keySkills?.split(',') || [],
        shortBio: body.shortBio,
        languages: body.languages?.split(',') || [],
        yearsOfExperience: Number(body.yearsOfExperience),
        category: body.category,
        profileHealth: Number(body.profileHealth || 0),
      },
      documents: {
        resume: resume?.url,
        other: body.other || [],
      },
    };

    // KYC
    updateData.kycVerify = {
      aadharNumber: body.aadharNumber,
      aadharURL: body.aadharURL,
      panNumber: body.panNumber,
      panURL: body.panURL,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});


//---------------------------------Upgrade Profile------------------------------------------------//

export const aadharVerify = asyncHandler(async (req, res) => {
  console.log('api hit');
  
  // Get token from cookies
  const token = req.cookies?.accessToken;
console.log('token', token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Decode token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.log('Unauthorized: Invalid token' , err);
    
    return res.status(401).json({ message: "Unauthorized: Invalid token" });

  }

  const { _id } = decoded;
  const fieldsToModify = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { $set: fieldsToModify },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "Aadhar details updated successfully",
    user: updatedUser,
  });
});

export const consultantApplication = asyncHandler(async (req, res) => {
  console.log(req.body);
  
  try {
    const cookie = req.cookies?.accessToken;
    if (!cookie) {
      return res.status(401).json(ApiResponse(401, 'Unauthorized access'));
    }

    const decoded = jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET);
    const { _id } = decoded;
    const data = req.body;

    const resumeFile = req.files?.resume?.[0];
  if (!resumeFile)
    return res.status(400).json({ message: "Resume file is missing" });
  const resume = await uploadOnCloudinary(resumeFile.path, "raw");
  if (!resume?.url)
    return res.status(400).json({ message: "Failed to upload resume" });
    

 let user = await User.findByIdAndUpdate(
  _id,
  {
    $set: {
      'consultantRequest.status': 'pending',
      'consultantRequest.requestedAt': new Date(),
      'consultantRequest.documents.resume': resume?.url,

      'consultantRequest.consultantProfile.sessionFee': Number(data.rate),
      'consultantRequest.consultantProfile.daysPerWeek': data.daysPerWeek || '5',
      'consultantRequest.consultantProfile.qualification': data.qualification,
      'consultantRequest.consultantProfile.fieldOfStudy': data.field,
      'consultantRequest.consultantProfile.university': data.university,
      'consultantRequest.consultantProfile.graduationYear': Number(data.graduationYear),
      'consultantRequest.consultantProfile.shortBio': data.shortBio || '',
      'consultantRequest.consultantProfile.languages': Array.isArray(data.languages)
        ? data.languages
        : [data.languages],
      'consultantRequest.consultantProfile.yearsOfExperience': Number(data.experience),
      'consultantRequest.consultantProfile.category': data.category,
    },
  },
  { new: true }
);



    if (!user) {
      return res.status(404).json(ApiResponse(404, 'User not found'));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, 'Consultant application submitted', user));
  } catch (error) {
    console.error('Error in consultantApplication:', error);
    return res.status(500).json(ApiResponse(500, 'Something went wrong'));
  }
});




import { Admin } from "../models/Admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Consultant } from "../models/ConsultantModel.js";
import {User} from '../models/UserModel.js'
import sendEmail from "../utils/email.service.js";
import { Booking } from "../models/BookingModel.js";
import bcrypt from "bcryptjs";
const generateAccessAndRefreshToken = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.genrateAccessToken();
    const refreshToken = admin.genrateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to generate access token and refresh token"
    );
  }
};

// admin registration controller
export const registerAdmin = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { name, email, password, phoneNumber } = req.body;

  if (
    [name, email, password, phoneNumber].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  const existingAdmin = await Admin.findOne({
    $or: [{ email: email }, { phoneNumber: phoneNumber }],
  });

  if (existingAdmin) {
    throw new ApiError(
      400,
      " Admin With E-mail or Phonenumber already exists already exists"
    );
  }

  const admin = await Admin.create({
    name: name.toLowerCase(),
    email,
    password,
    phoneNumber,
  });

  const registeredAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  if (!registeredAdmin) {
    throw new ApiError(500, "Failed to register admin");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Admin registered successfully", registeredAdmin)
    );
});

// admin login controller

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password, phoneNumber } = req.body;

  if ((!email && !phoneNumber) || !password) {
    throw new ApiError(400, "email/Username and Password are required");
  }

  const admin = await Admin.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // checking if password is valid or not
  if (!admin.comparePassword(password)) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );

  const loggedinAdmin = await Admin.findById(admin._id).select(
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
    .json(
      new ApiResponse(
        200,
        { admin: loggedinAdmin, accessToken, refreshToken }, // here we are handeling the case where admin wants to set his cokkies him self in his local system may be he wants to login from another device
        "Admin logged in successfully"
      )
    );
});

//logout Admin controller
export const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
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
    .json(new ApiResponse(200, "Admin logged out successfully"));
});

// admin see list of unapproved consultants
export const unapprovedConsultants = asyncHandler(async (req, res) => {
  const consultants = await User.find({ 
    "consultantRequest.status": "pending" 
  });

  return res.status(200).json(new ApiResponse(200, consultants));
});
export const rejectedConsultants = asyncHandler(async (req, res) => {
 const consultants = await User.find(
  { "consultantRequest.status": "rejected" }
).select("-password");

  return res.status(200).json(new ApiResponse(200, consultants));
});


// admin see list of approved consultants
export const approvedConsultants = asyncHandler(async (req, res) => {
  const consultants = await User.find({ isApproved: true });
  return res.status(200).json(new ApiResponse(200, consultants));
});

// admin approve consultant
export const approveConsultant = asyncHandler(async (req, res) => {
  const { consultantId } = req.params;
  const consultant = await User.findById(consultantId);
  if (!consultant) {
    throw new ApiError(404, "Consultant not found");
  }
  consultant.consultantRequest.status = "approved";
  consultant.role = "consultant";
  await consultant.save();

  // Send approval email
  try {
    await sendEmail({
      to: consultant.email,
      subject: "Consultant Application Approved 🎉",
      text: `Dear ${consultant.fullName},\n\nCongratulations! Your consultant application has been approved.\n\nYou can now log in and start using our platform.\n\nBest Regards,\nParrot Consulting Team`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consultant Application Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
        
        <!-- Header with Logo -->
        <div style="background: linear-gradient(135deg, #227247 0%, #156a51 100%); padding: 40px 30px; text-align: center; border-radius: 0;">
            <img src="https://parrotconsult.com/parrot1.png" alt="Parrot Consulting Logo" style="height: 60px; width: auto; margin-bottom: 20px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                Welcome to Our Consultant Network!
            </h1>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            
            <!-- Greeting -->
            <p style="font-size: 18px; color: #082f2c; margin: 0 0 25px 0; font-weight: 500;">
                Dear <strong style="color: #d36338;">${consultant.fullName}</strong>,
            </p>

            <!-- Success Message -->
            <div style="background: linear-gradient(135deg, #227247, #156a51); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -50%; width: 100%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); transform: rotate(45deg);"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
                    <h2 style="color: #ffffff; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                        Congratulations!
                    </h2>
                    <p style="color: #ffffff; margin: 0; font-size: 16px; opacity: 0.95;">
                        Your consultant application has been <strong>approved</strong>
                    </p>
                </div>
            </div>

            <!-- Upgrade Notice -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #d36338; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #082f2c; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">
                    🚀 Profile Upgraded
                </h3>
                <p style="color: #156a51; margin: 0; font-size: 15px;">
                    Your profile has been upgraded from <strong>User</strong> to <strong>Consultant</strong>. You can now update your consultant profile and start showcasing your expertise.
                </p>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://parrotconsult.com/login&signup" style="display: inline-block; background: linear-gradient(135deg, #d36338 0%, #227247 100%); color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(211, 99, 56, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;">
                    Login to Platform
                </a>
            </div>

            <!-- Additional Info -->
            <div style="background-color: #ffffff; border: 1px solid #e9ecef; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #082f2c; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                    What's Next?
                </h3>
                <ul style="color: #156a51; margin: 0; padding-left: 20px; font-size: 14px;">
                    <li style="margin-bottom: 8px;">Complete your consultant profile</li>
                    <li style="margin-bottom: 8px;">Set your availability and rates</li>
                    <li style="margin-bottom: 8px;">Start connecting with clients</li>
                    <li>Begin earning as a certified consultant</li>
                </ul>
            </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #082f2c; padding: 30px; text-align: center;">
            <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;">
                Best Regards,
            </p>
            <p style="color: #d36338; margin: 0; font-size: 18px; font-weight: 600;">
                Parrot Consulting Team
            </p>
            
            <!-- Social Links -->
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #156a51;">
                <p style="color: #ffffff; opacity: 0.8; margin: 0; font-size: 12px;">
                    © 2025 Parrot Consulting. All rights reserved.
                </p>
            </div>
        </div>

    </div>
</body>
</html>`,
    });
  } catch (error) {
    console.error("Error sending approval email:", error);
    // You may log this or use a fallback
  }

  return res
    .status(200)
    .json(new ApiResponse(200, consultant, "Consultant approved successfully"));
});

// admin reject consultant
export const rejectConsultant = asyncHandler(async (req, res) => {
  const { consultantId } = req.params;
    console.log('iahsb rejected' , consultantId);

  const consultant = await User.findById(consultantId);
  if (!consultant) {
    throw new ApiError(404, "Consultant not found");
  }

  consultant.consultantRequest.status = "rejected";
  await consultant.save();

  try {
    await sendEmail({
      to: consultant.email,
      subject: "Consultant Application Rejected",
      text: `Dear ${consultant.fullName},\n\nWe regret to inform you that your application has been rejected.\n\nRegards,\nParrot Consulting Team`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consultant Application Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
        
        <!-- Header with Logo -->
        <div style="background: linear-gradient(135deg, #227247 0%, #156a51 100%); padding: 40px 30px; text-align: center; border-radius: 0;">
            <img src="https://parrotconsult.com/parrot1.png" alt="Parrot Consulting Logo" style="height: 60px; width: auto; margin-bottom: 20px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                Application Update
            </h1>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            
            <!-- Greeting -->
            <p style="font-size: 18px; color: #082f2c; margin: 0 0 25px 0; font-weight: 500;">
                Dear <strong style="color: #d36338;">${consultant.fullName}</strong>,
            </p>

            <!-- Thank You Message -->
            <p style="color: #156a51; margin: 0 0 25px 0; font-size: 16px; line-height: 1.7;">
                Thank you for taking the time to apply for our consultant program. We truly appreciate your interest in joining the Parrot Consulting network.
            </p>

            <!-- Decision Message -->
            <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #d36338; position: relative;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 32px; margin-bottom: 10px;">📋</div>
                </div>
                <p style="color: #082f2c; margin: 0; font-size: 16px; text-align: center; line-height: 1.6;">
                    After careful review of your application, we regret to inform you that we are <strong style="color: #d36338;">unable to approve</strong> your consultant application at this time.
                </p>
            </div>

            <!-- Explanation -->
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #082f2c; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                    Why This Decision?
                </h3>
                <p style="color: #156a51; margin: 0 0 15px 0; font-size: 15px; line-height: 1.6;">
                    Our selection process is highly competitive, and we have specific criteria based on current market needs, expertise requirements, and platform capacity. This decision does not reflect your professional capabilities or potential.
                </p>
                <p style="color: #156a51; margin: 0; font-size: 15px; line-height: 1.6;">
                    We encourage you to continue developing your skills and consider reapplying in the future.
                </p>
            </div>

            <!-- Future Opportunities -->
            <div style="background-color: #ffffff; border: 1px solid #227247; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #227247; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                    🌟 Future Opportunities
                </h3>
                <ul style="color: #156a51; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                    <li style="margin-bottom: 10px;">You can reapply after <strong>6 months</strong></li>
                    <li style="margin-bottom: 10px;">Continue to build your expertise in your field</li>
                    <li style="margin-bottom: 10px;">Stay updated with our platform requirements</li>
                    <li>Consider our training programs and workshops</li>
                </ul>
            </div>

            <!-- Stay Connected -->
            <div style="text-align: center; margin: 35px 0;">
                <p style="color: #082f2c; margin: 0 0 20px 0; font-size: 16px; font-weight: 500;">
                    Stay connected with us for future opportunities
                </p>
                <a href="https://parrotconsult.com/login&signup" style="display: inline-block; background: linear-gradient(135deg, #227247 0%, #156a51 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(34, 114, 71, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;">
                    Continue as User
                </a>
            </div>

            <!-- Support -->
            <div style="background: linear-gradient(135deg, #082f2c, #156a51); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 15px;">
                    <strong>Need Support or Have Questions?</strong>
                </p>
                <p style="color: #ffffff; margin: 0; font-size: 14px; opacity: 0.9;">
                    Our team is here to help. Feel free to reach out for guidance on improving your application.
                </p>
            </div>

            <!-- Closing -->
            <p style="color: #156a51; margin: 30px 0 0 0; font-size: 16px; line-height: 1.7;">
                We appreciate your understanding and wish you the best in your professional endeavors. Thank you for considering Parrot Consulting as your platform of choice.
            </p>

        </div>

        <!-- Footer -->
        <div style="background-color: #082f2c; padding: 30px; text-align: center;">
            <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;">
                Best Regards,
            </p>
            <p style="color: #d36338; margin: 0; font-size: 18px; font-weight: 600;">
                Parrot Consulting Team
            </p>
            
            <!-- Social Links -->
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #156a51;">
                <p style="color: #ffffff; opacity: 0.8; margin: 0; font-size: 12px;">
                    © 2025 Parrot Consulting. All rights reserved.
                </p>
            </div>
        </div>

    </div>
</body>
</html>`,
    });
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    // Optionally handle retry or fallback
  }

  // await Consultant.findByIdAndDelete(consultantId);

  await Consultant.findByIdAndUpdate(consultantId, {
    $set: {
      isApproved: false,
      status: "rejected",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, consultant, "Consultant rejected successfully"));
});

// admin get all booking

export const adminGetAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ status: "scheduled" })
    .populate("user")
    .populate("consultant");
  return res.status(200).json(new ApiResponse(200, bookings));
});

export const getAdmin = asyncHandler(async (req, res) => {
  const result = await Admin.find();
  res.status(200).json(result);
});
export const passupdate = asyncHandler(async (req, res) => {
  const email = "dhimanabhinav675@gmail.com";
  const tempPassword = "abhishek"; // Your temporary password

  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const result = await Admin.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );

  if (!result) {
    res.status(404);
    throw new Error("Admin not found");
  }

  res.status(200).json({ message: "Password reset successfully" });
});

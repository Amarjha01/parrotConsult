import {User} from "../models/UserModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import sendEmail from "../utils/email.service.js";

export const seeallactiveconsultants = asyncHandler(async (req, res) => {
    const consultants = await User.find({ role : 'consultant' });
    return res.status(200).json(new ApiResponse(200, consultants));
 
    
});



export const viewSingleConsultant = asyncHandler(async (req , res) =>{
   
    const {id} = req.body
    
    const consultant = await User.findById(id)
    return res.status(200).json(new ApiResponse(200 , consultant))
})

export const sendContactUsData = asyncHandler(async(req , res)=>{
    try {
        const {name , email , subject , message} = req.body
        console.log(req.body);
        
        await sendEmail(
            {
                to:[`contact@amarjha.dev , amarjha.dev@gmail.com , parrotconsult.com@gmail.com`],
                subject: subject,
                text:'New Contact Form Submission',
                html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <!-- Main Container -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <!-- Email Content Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                📧 New Contact Form Submission
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e8f0fe; font-size: 16px; opacity: 0.9;">
                                You have received a new message from your website
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            
                            <!-- Alert Banner -->
                            <div style="background-color: #e8f5e8; border: 1px solid #4caf50; border-radius: 6px; padding: 15px; margin-bottom: 30px; text-align: center;">
                                <p style="margin: 0; color: #2e7d32; font-size: 14px; font-weight: 600;">
                                    ✅ New inquiry received - Please respond within 24 hours
                                </p>
                            </div>

                            <!-- Contact Information Cards -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td width="50%" style="padding-right: 15px; vertical-align: top;">
                                        <!-- Name Card -->
                                        <div style="background-color: #f8faff; border: 1px solid #e3f2fd; border-radius: 8px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #2196f3;">
                                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                                <div style="width: 32px; height: 32px; background-color: #2196f3; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                                    <span style="color: white; font-size: 16px;">👤</span>
                                                </div>
                                                <h3 style="margin: 0; color: #1976d2; font-size: 16px; font-weight: 600;">Full Name</h3>
                                            </div>
                                            <p style="margin: 0; color: #333333; font-size: 18px; font-weight: 500; word-break: break-word;">
                                                ${name}
                                            </p>
                                        </div>
                                    </td>
                                    <td width="50%" style="padding-left: 15px; vertical-align: top;">
                                        <!-- Email Card -->
                                        <div style="background-color: #f3e5f5; border: 1px solid #e1bee7; border-radius: 8px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #9c27b0;">
                                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                                <div style="width: 32px; height: 32px; background-color: #9c27b0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                                    <span style="color: white; font-size: 16px;">📧</span>
                                                </div>
                                                <h3 style="margin: 0; color: #7b1fa2; font-size: 16px; font-weight: 600;">Email Address</h3>
                                            </div>
                                            <p style="margin: 0; color: #333333; font-size: 18px; font-weight: 500; word-break: break-all;">
                                                <a href="mailto:${email}" style="color: #7b1fa2; text-decoration: none;">${email}</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Subject Card -->
                            <div style="background-color: #fff3e0; border: 1px solid #ffcc02; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #ff9800;">
                                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <div style="width: 32px; height: 32px; background-color: #ff9800; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                        <span style="color: white; font-size: 16px;">📌</span>
                                    </div>
                                    <h3 style="margin: 0; color: #e65100; font-size: 16px; font-weight: 600;">Subject</h3>
                                </div>
                                <p style="margin: 0; color: #333333; font-size: 20px; font-weight: 600; line-height: 1.4; word-break: break-word;">
                                    ${subject}
                                </p>
                            </div>

                            <!-- Message Card -->
                            <div style="background-color: #f1f8e9; border: 1px solid #c8e6c9; border-radius: 8px; padding: 25px; border-left: 4px solid #4caf50;">
                                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                    <div style="width: 32px; height: 32px; background-color: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                        <span style="color: white; font-size: 16px;">💬</span>
                                    </div>
                                    <h3 style="margin: 0; color: #2e7d32; font-size: 16px; font-weight: 600;">Message</h3>
                                </div>
                                <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; border: 1px solid #e0e0e0;">
                                    <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">${message}</p>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 40px;">
                                <tr>
                                    <td align="center">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-right: 10px;">
                                                    <a href="mailto:${email}?subject=Re: ${subject}" 
                                                       style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #4caf50, #45a049); color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3); transition: all 0.3s ease;">
                                                        📧 Reply to ${name}
                                                    </a>
                                                </td>
                                              
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <div style="margin-bottom: 20px;">
                                <img src="https://parrotconsult.com/parrot1.png" alt="Company Logo" style="height: 40px;">
                            </div>
                            
                            <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px; line-height: 1.5;">
                                📅 <strong>Received:</strong>${new Date().toLocaleString()}<br>
                                🌐 <strong>Source:</strong> Website Contact Form<br>
                                📍 <strong>IP Address:</strong> ${req.ip}
                            </p>
                            
                            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px;">
                                <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.4;">
                                    This email was automatically generated from your website contact form.<br>
                                    Please do not reply directly to this email address.
                                </p>
                                
                                <div style="margin-top: 15px;">
                                    <a href="#" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy Policy</a>
                                    <a href="#" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Contact Us</a>
                                    <a href="#" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 10px;">Unsubscribe</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
            }
        )

        res.status(200).json({
            message:'form submited successfully'
        })
    } catch (error) {
        console.log(error);
        
    }
})
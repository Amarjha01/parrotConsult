import { sendOtpSMS, verifyOtpSMS } from "../utils/OtpServices.js";

export const sendOtpSms = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const response = await sendOtpSMS(phone);
    console.log("Phone No:", phone);

    if (response.success) {
      return res.status(200).json({
        message: "OTP sent successfully",
        sessionID: response.sessionID,
      });
    } else {
      return res.status(500).json({
        message: response.message || "Failed to send OTP",
      });
    }
  } catch (error) {
    console.log("sendOtpSms error:", error.message || error);
    return res.status(500).json({
      message: "Internal Server Error while sending OTP",
    });
  }
};

export const verifyOtpSms = async (req, res) => {
  try {
    const { sessionId, otp } = req.body;

    if (!sessionId || !otp) {
      return res.status(400).json({
        message: "Either session ID or OTP is missing",
      });
    }

    const response = await verifyOtpSMS(sessionId, otp);

    if (response.success) {
      return res.status(200).json({
        message: "OTP verified successfully",
      });
    } else {
      return res.status(400).json({
        message: response.message || "OTP verification failed",
      });
    }
  } catch (error) {
    console.log("verifyOtpSms error:", error.message || error);
    return res.status(500).json({
      message: "Internal Server Error while verifying OTP",
    });
  }
};

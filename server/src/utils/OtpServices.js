import axios from 'axios';

export const sendOtpSMS = async (phone) => {
  const apiKey = process.env.TWOFACTOR_API_KEY;
  const template = "OTP1";

  try {
    if (!phone) throw new Error("Phone number is required");

    const response = await axios.get(
      `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/AUTOGEN/${template}`
    );

    if (response.data.Status !== "Success") {
      throw new Error(response.data.Details || "Failed to send OTP");
    }

    return {
      success: true,
      message: "OTP sent successfully",
      sessionID: response.data.Details
    };
  } catch (error) {
    console.error("Error in sendOtpSMS:", error?.response?.data || error.message);

    return {
      success: false,
      message:
        error?.response?.data?.Details ||
        error?.message ||
        "Something went wrong while sending OTP",
    };
  }
};


export const verifyOtpSMS = async (sessionId, otp) => {
  const apiKey = process.env.TWOFACTOR_API_KEY;

  try {
    if (!sessionId || !otp) throw new Error("Session ID and OTP are required");

    const response = await axios.get(
      `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`
    );

    if (response.data.Status === "Success" && response.data.Details === "OTP Matched") {
      return {
        success: true,
        message: "OTP verified successfully"
      };
    } else {
      throw new Error(response.data.Details || "OTP verification failed");
    }
  } catch (error) {
    console.error("Error in verifyOtpSMS:", error?.response?.data || error.message);

    return {
      success: false,
      message:
        error?.response?.data?.Details ||
        error?.message ||
        "Something went wrong while verifying OTP",
    };
  }
};

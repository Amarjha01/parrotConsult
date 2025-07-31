
import axios from 'axios';
const BaseURL = import.meta.env.VITE_API_BASE_URL


export const OtpSms = async (phone) =>{
    console.log("parameter phone" , phone);
    
try {
    if(!phone){
        return "please provide phone no.";
    }

    const response = await axios.post(`${BaseURL}/auth/send-otp` , 
        {phone:phone}, 
        { withCredentials: true},
        
    )

    return response;

} catch (error) {
    console.log('error in sending otp' , error);
    
}
}

export const verifyOtpSMS = async (sessionId, otp) =>{
console.log('ghjjhgotp' , otp , sessionId);

try {
    if(!sessionId && !otp) {
        return "please provide sessionID and OTP."
    }

    const response = await axios.post(`${BaseURL}/auth/verify-otp` , {sessionId , otp} , {withCredentials:true})
    return response
    console.log("function verify otp " , response);
    
} catch (error) {
    
}
}
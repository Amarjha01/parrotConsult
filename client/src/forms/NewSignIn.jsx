// Updated NewSignIn Flow: Phone -> OTP -> Password
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, Smartphone, CheckCircle } from 'lucide-react';
import { OtpSms, verifyOtpSMS } from '../apis/otpApi.js';
import { showErrorToast, showInfoToast, showSuccessToast } from '../util/Notification.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../apis/userApi.js';
export default function NewSignIn() {
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [sessionID, setSessionID] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handlePhoneSubmit = async () => {
    if (!validatePhone(phoneNumber)) return showInfoToast('Enter valid phone number');
    setLoading(true);
    try {
      const res = await OtpSms(phoneNumber);
      setSessionID(res.data.sessionID);
      setStep('otp');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (!/\d?/.test(value)) return;
    const otpArr = otp.split('');
    otpArr[index] = value;
    const updated = otpArr.join('').padEnd(6, '');
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleOtpSubmit = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const res = await verifyOtpSMS(sessionID, otp);
      if (res.status === 200) {
        showSuccessToast('OTP Verified');
        setOtpVerified(true)
        setStep('password');
      }
    } catch (err) {
      console.error(err);
      showErrorToast('OTP verification Failed ')
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password || password.length < 6) {
      return showInfoToast('Enter a valid password');
    }
  
try {
    const response = await loginUser({phoneNumber , password , otpVerified})
    if (response.status === 200) {
  showSuccessToast(response.data.message);
  console.log(response.data);

  // ⬇️ Store the user data in localStorage
  localStorage.setItem("user", JSON.stringify(response.data.data));


  // ⬇️ Redirect to dashboard
  setTimeout(() => navigate("/userdashboard/dashboard"), 1000);
}

} catch (error) {
  console.log(error);
  
}
 }

  const renderPhoneStep = () => (
    <div className="space-y-6 bac">
      <div>
        <label className="text-white font-medium mb-1 block">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter phone number"
          />
        </div>
      </div>
      <button
        onClick={handlePhoneSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-6">
      <div>
        <label className="text-white font-medium mb-1 block">Enter OTP</label>
        <div className="flex space-x-2 justify-center">
          {Array(6).fill('').map((_, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              maxLength={1}
              value={otp[idx] || ''}
              onChange={(e) => handleOTPChange(idx, e.target.value)}
              className="w-10 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          ))}
        </div>
      </div>
      <button
        onClick={handleOtpSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div>
        <label className="text-white font-medium mb-1 block">Enter Your Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter Your Password"
          />
        </div>
      </div>
      <button
        onClick={handlePasswordSubmit}
        className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
      >
        Sign In
      </button>
    </div>
  );

  return (
    <div className="md:min-h-screen h-[90vh] text-white bg-gradient-to-r from-green-900 via-green-800 to-green-950 flex items-center justify-center px-4 ">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" backdrop-blur-2xl w-full max-w-md rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center text-green-300 mb-6">Sign In</h2>
        <AnimatePresence mode="wait">
          {step === 'phone' && renderPhoneStep()}
          {step === 'otp' && renderOtpStep()}
          {step === 'password' && renderPasswordStep()}
        </AnimatePresence>
        <div className='flex justify-center items-center mt-5 gap-1'>
           <p>Don't have account ?</p> 
           <a className=' text-green-500' href="/newsignup">sign up</a>
        </div>
      </motion.div>
     
    </div>
  );
}

// Simple Signup Page with Full Name, Phone, and Password
import React, { useState } from 'react';
import { Phone, Lock, User, Eye, EyeOff } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showInfoToast, showErrorToast } from '../util/Notification.jsx';
import 'react-toastify/dist/ReactToastify.css';
import AIParrot from '../assets/AIParrot.jpg'
import { registerUser } from '../service/userApi.js';

export default function NewSignUp() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!fullName || !phone || !password) {
      showInfoToast('Please fill in all fields');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      showInfoToast('Enter a valid 10-digit Indian phone number');
      return false;
    }
    if (password.length < 6) {
      showInfoToast('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // call backend signup API
     const response = await registerUser({ fullName, phone, password });
    console.log("response" , response);

     if(response.status === 201){
     showSuccessToast(response.data.message);
     showInfoToast('Redirecting To login page.')
     setTimeout(() => {
        window.location.href = '/newSignIn'
     }, 1000);
     }
      
    } catch (err) {
    showErrorToast(err.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{backgroundImage:`url(${AIParrot})`}}>
      <ToastContainer />
      <div className=" backdrop-blur-2xl max-w-md w-full rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Sign Up</h2>

        <div className="space-y-5">
          <div>
            <label className="text-white font-medium mb-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 py-3 rounded-xl border  text-white border-gray-300 focus:outline-none focus:border-0 focus:ring-2 focus:ring-green-600"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="text-white font-medium mb-1 block">Phone Number</label>
            <div className="relative">
              <Phone className=" absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 py-3 rounded-xl border outline-none text-white border-gray-300 focus:outline-none focus:border-0 focus:ring-2 focus:ring-green-600"
                placeholder="Enter 10-digit phone"
              />
            </div>
          </div>

          <div>
            <label className="text-white font-medium mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border outline-none text-white border-gray-300 focus:outline-none focus:border-0 focus:ring-2 focus:ring-green-600"
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>

        <div className='flex gap-1 justify-center items-center mt-5 text-white'> 
          <p>Already have account ? </p> 
          <a className='text-green-500' href="/newSignIn">Sign In</a>
        </div>
      </div>
    </div>
  );
}

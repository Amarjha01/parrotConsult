import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import axios from 'axios';
import { loginUser } from '../apis/userApi';

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError
  } = useForm();

  const password = watch('password');

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const endpoint = isSignUp ? '/signup' : '/login';
      
      // For signup, exclude confirmPassword from data sent to backend
      const submitData = isSignUp 
        ? { 
            name: data.name, 
            email: data.email, 
            phone: data.phone, 
            password: data.password 
          }
        : {
            email: data.email,
            password: data.password
          };

      const response = await loginUser(data);
      
      console.log('Auth success:', response.data);
       const userData = response.data?.status;
          const role = userData?.role?.toLowerCase();
          if (!role) throw new Error("No user role found.");
      localStorage.setItem(role, JSON.stringify(userData));
      // Handle success (store token, redirect, etc.)
      onClose();
      reset();
    } catch (error) {
      console.error('Auth error:', error);
      if (error.response?.data?.message) {
        setError('root', { message: error.response.data.message });
      } else {
        setError('root', { message: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-[#113a39] rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center">
              <motion.div
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {isSignUp 
                    ? 'Join us and start your consultation journey' 
                    : 'Sign in to access your dashboard'
                  }
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isSignUp ? 'signup-fields' : 'signin-fields'}
                    initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Name Field (Sign Up Only) */}
                    {isSignUp && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            {...register('name', { 
                              required: 'Name is required',
                              minLength: { value: 2, message: 'Name must be at least 2 characters' }
                            })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#348559] focus:ring-2 focus:ring-[#348559]/20 transition-all duration-300"
                            placeholder="Enter your full name"
                          />
                        </div>
                        {errors.name && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs"
                          >
                            {errors.name.message}
                          </motion.p>
                        )}
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#348559] focus:ring-2 focus:ring-[#348559]/20 transition-all duration-300"
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Phone Field (Sign Up Only) */}
                    {isSignUp && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="tel"
                            {...register('phone', { 
                              required: 'Phone number is required',
                              pattern: {
                                value: /^[0-9]{10,}$/,
                                message: 'Please enter a valid phone number'
                              }
                            })}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#348559] focus:ring-2 focus:ring-[#348559]/20 transition-all duration-300"
                            placeholder="Enter your phone number"
                          />
                        </div>
                        {errors.phone && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs"
                          >
                            {errors.phone.message}
                          </motion.p>
                        )}
                      </div>
                    )}

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          {...register('password', { 
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                          })}
                          className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#348559] focus:ring-2 focus:ring-[#348559]/20 transition-all duration-300"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs"
                        >
                          {errors.password.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Confirm Password Field (Sign Up Only) */}
                    {isSignUp && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword', { 
                              required: 'Please confirm your password',
                              validate: value => value === password || 'Passwords do not match'
                            })}
                            className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#348559] focus:ring-2 focus:ring-[#348559]/20 transition-all duration-300"
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs"
                          >
                            {errors.confirmPassword.message}
                          </motion.p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Error Message */}
                {errors.root && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center"
                  >
                    {errors.root.message}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#348559] to-[#09533d] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#09533d] hover:to-[#113a39] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  )}
                </motion.button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="ml-2 text-[#348559] hover:text-[#09533d] font-medium transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
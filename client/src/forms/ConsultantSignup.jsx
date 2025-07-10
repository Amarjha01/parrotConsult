import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Eye, EyeOff, Upload, X, CheckCircle, AlertCircle,
  User, Mail, Phone, Lock, FileText, CreditCard
} from 'lucide-react';

export default function ConsultantSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState({ aadhar: null, pan: null });
  const [errorsFile, setErrorsFile] = useState({ aadhar: '', pan: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm();

  const validateFile = (file, type) => {
    if (!file) return `${type} card is required`;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) return `${type} must be in JPG, PNG, or JPEG format`;
    if (file.size > 2 * 1024 * 1024) return `${type} size must not exceed 2MB`;
    return '';
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    const error = validateFile(file, type);
    setErrorsFile(prev => ({ ...prev, [type.toLowerCase()]: error }));
    setFiles(prev => ({ ...prev, [type.toLowerCase()]: error ? null : file }));
    setValue(type.toLowerCase(), error ? null : file);
    if (!error) clearErrors(type.toLowerCase());
  };

  const removeFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setErrorsFile(prev => ({ ...prev, [type]: '' }));
    setValue(type, null);
  };

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    alert('Registration successful! Welcome to our consulting platform.');
  };

  const InputField = ({ icon: Icon, id, label, type = 'text', rules, placeholder }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          id={id}
          type={type}
          {...register(id, rules)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a4e] focus:border-transparent transition-all"
        />
      </div>
      {errors[id] && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[id].message}
        </p>
      )}
    </div>
  );

  const FileUpload = ({ type, icon: Icon, file, error }) => {
    const lower = type.toLowerCase();
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload {type} Card<span className="text-red-500 ml-1">*</span>
        </label>
        {!file ? (
          <label
            htmlFor={`${lower}-upload`}
            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2b7a4e] transition-colors flex flex-col items-center space-y-2"
          >
            <input
              type="file"
              id={`${lower}-upload`}
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, type)}
              className="hidden"
            />
            <Icon className="w-12 h-12 text-gray-400" />
            <span className="text-sm text-gray-500">Click to upload {type} card</span>
            <span className="text-xs text-gray-400">JPG, PNG, JPEG (Max 2MB)</span>
          </label>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(lower)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        {error && (
          <p className="flex items-center text-sm text-red-500">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b7a4e] to-[#244b44] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Become a Consultant</h1>
          <p className="text-xl text-green-100">Join our platform and start your consulting journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                id="name"
                icon={User}
                label="Full Name"
                placeholder="Enter your full name"
                rules={{
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                }}
              />
              <InputField
                id="email"
                type="email"
                icon={Mail}
                label="Email Address"
                placeholder="Enter your email address"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
              />
              <InputField
                id="phone"
                type="tel"
                icon={Phone}
                label="Phone Number"
                placeholder="Enter your phone number"
                rules={{
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Enter a valid 10-digit phone number'
                  }
                }}
              />
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                        message: 'Must include upper, lower, number, and special character'
                      }
                    })}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a4e] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload type="Aadhar" icon={CreditCard} file={files.aadhar} error={errorsFile.aadhar} />
              <FileUpload type="PAN" icon={FileText} file={files.pan} error={errorsFile.pan} />
            </div>

            <input type="hidden" {...register('aadhar', { required: 'Aadhar card is required' })} />
            <input type="hidden" {...register('pan', { required: 'PAN card is required' })} />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2b7a4e] to-[#18694f] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#18694f] hover:to-[#244b44] focus:ring-2 focus:ring-[#2b7a4e] transition-all transform hover:scale-105 active:scale-95"
            >
              Join as Consultant
            </button>

            <p className="text-sm text-gray-600 text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="text-[#2b7a4e] hover:text-[#18694f] font-medium">Terms of Service</a> and{' '}
              <a href="#" className="text-[#2b7a4e] hover:text-[#18694f] font-medium">Privacy Policy</a>
            </p>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-green-100">
            Already have an account?{' '}
            <a href="#" className="text-white font-semibold hover:text-green-200 transition-colors">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

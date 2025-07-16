import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Phone, 
  Mail, 
  UploadCloud, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  MapPin, 
  Calendar,
  Shield,
  Check,
  AlertCircle
} from "lucide-react";

const Profile = ({ userData }) => {
  const [formData, setFormData] = useState({
    email: userData?.email || "",
    fullName: userData?.fullName || "",
    phone: userData?.phone || "",
    location: userData?.location || "",
    bio: userData?.bio || ""
  });
  
  const [profileImage, setProfileImage] = useState(userData?.profileImage || "");
  const [editing, setEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }
      
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        setProfileImage(url);
        setIsUploading(false);
      }, 1000);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    // Simulate API call
    setTimeout(() => {
      setEditing(false);
      // Show success message
    }, 500);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      email: userData?.email || "",
      fullName: userData?.fullName || "",
      phone: userData?.phone || "",
      location: userData?.location || "",
      bio: userData?.bio || ""
    });
    setValidationErrors({});
    setEditing(false);
  };

  const InputField = ({ icon: Icon, label, value, onChange, type = "text", error, placeholder }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Icon size={16} className="text-gray-500" />
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
            error 
              ? 'border-red-300 focus:border-red-500 bg-red-50' 
              : 'border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300'
          }`}
        />
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle size={16} className="text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <AlertCircle size={14} />
          {error}
        </motion.p>
      )}
    </div>
  );

  const DisplayField = ({ icon: Icon, label, value, color = "text-gray-700" }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon size={18} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-base font-semibold ${color}`}>{value || "Not provided"}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-4xl mx-auto overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <Shield size={14} />
            Verified
          </div>
        </div>
      </div>

      {/* Profile Image Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img
                src={profileImage || "/api/placeholder/150/150"}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
            
            <AnimatePresence>
              {editing && (
                <motion.label
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full cursor-pointer hover:from-blue-600 hover:to-purple-600 shadow-lg transition-all duration-200"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="text-white w-5 h-5" />
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </motion.label>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Profile Photo</p>
            <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={User}
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(value) => handleInputChange('fullName', value)}
                    error={validationErrors.fullName}
                    placeholder="Enter your full name"
                  />
                  <InputField
                    icon={Mail}
                    label="Email Address"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    type="email"
                    error={validationErrors.email}
                    placeholder="Enter your email"
                  />
                  <InputField
                    icon={Phone}
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    type="tel"
                    error={validationErrors.phone}
                    placeholder="Enter your phone number"
                  />
                  <InputField
                    icon={MapPin}
                    label="Location"
                    value={formData.location}
                    onChange={(value) => handleInputChange('location', value)}
                    placeholder="Enter your location"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <Edit3 size={16} className="text-gray-500" />
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white hover:border-gray-300 transition-all duration-200 resize-none"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <DisplayField
                  icon={User}
                  label="Full Name"
                  value={formData.fullName}
                  color="text-gray-900"
                />
                <DisplayField
                  icon={Mail}
                  label="Email Address"
                  value={formData.email}
                  color="text-blue-600"
                />
                <DisplayField
                  icon={Phone}
                  label="Phone Number"
                  value={formData.phone}
                  color="text-gray-700"
                />
                <DisplayField
                  icon={MapPin}
                  label="Location"
                  value={formData.location}
                  color="text-gray-700"
                />
                <DisplayField
                  icon={Calendar}
                  label="Member Since"
                  value="January 2024"
                  color="text-gray-700"
                />
                
                {formData.bio && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 mb-2">Bio</p>
                    <p className="text-gray-700 leading-relaxed">{formData.bio}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3"
            >
              <motion.button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X size={18} />
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={18} />
                Save Changes
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit3 size={18} />
              Edit Profile
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Profile;
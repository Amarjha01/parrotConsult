import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Briefcase, 
  Tag, 
  IndianRupee,
  Upload,
  Camera,
  FileText,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  BookOpen,
  School,
  Calendar,
Award,
Languages,
 Clock,
  Plus,
    CreditCard,
    Loader2
} from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showErrorToast, showSuccessToast } from '../util/Notification';
const ConsultantSignupForm = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
const [aadhaarFile, setAadhaarFile] = useState(null);
const [panFile, setPanFile] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState({
  monday: { enabled: false, timeSlots: [] },
  tuesday: { enabled: false, timeSlots: [] },
  wednesday: { enabled: false, timeSlots: [] },
  thursday: { enabled: false, timeSlots: [] },
  friday: { enabled: false, timeSlots: [] },
  saturday: { enabled: false, timeSlots: [] },
  sunday: { enabled: false, timeSlots: [] }
});
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm();

  const consultingCategories = [
    "Primary Consulting Category",
    "Business Strategy",
    "Information Technology", 
    "Marketing & Sales",
    "Finance & Accounting",
    "Human Resources",
    "Legal Advisory"
  ];

  const fieldOfStudy = [
  "Business Administration",
  "Computer Science",
  "Engineering",
  "Finance",
  "Marketing",
  "Medicine",
  "Law",
  "Other"
];

const highestQualification = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Diploma",
  "Certificate"
];

const languages = [
  "English",
  "Hindi", 
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Arabic",
  "Portuguese",
  "Russian",
  "Japanese",
  "Other"
];
const addTimeSlot = (day) => {
  setAvailability(prev => ({
    ...prev,
    [day]: {
      ...prev[day],
      timeSlots: [...(prev[day]?.timeSlots || []), { start: '09:00', end: '17:00' }]
    }
  }));
};

const removeTimeSlot = (day, index) => {
  setAvailability(prev => ({
    ...prev,
    [day]: {
      ...prev[day],
      timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
    }
  }));
};

const updateTimeSlot = (day, index, field, value) => {
  setAvailability(prev => ({
    ...prev,
    [day]: {
      ...prev[day],
      timeSlots: prev[day].timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }
  }));
};



const onSubmit = async (data) => {
  setIsLoading(true);
  console.log(data);

  const formData = new FormData();

  // ✅ Append file fields
  formData.append("profilePicture", data.profilePicture[0]);
  formData.append("resume", data.resume[0]);
  formData.append("panCard", data.panCard[0]);
  formData.append("aadhaarCard", data.aadhaarCard[0]);
  formData.append("certificates", data.certificates[0]); // Combined PDF

  // ✅ Append simple text/number fields
  const simpleFields = [
    "fullName", "email", "password", "phone", "address", "experience",
    "fieldOfStudy", "highestQualification", "graduationYear",
    "hourlyRate", "category", "universityName"
  ];

  simpleFields.forEach((field) => {
    formData.append(field, data[field]);
  });

  // ✅ Boolean fields
  formData.append("termsAccepted", data.termsAccepted === "true" || data.termsAccepted === true);
  formData.append("profileVisibility", data.profileVisibility === "true" || data.profileVisibility === true);

  // ✅ Append array fields as JSON strings
  formData.append("languages", JSON.stringify(data.languages));
  formData.append("specializedServices", JSON.stringify(data.specializedServices?.split(',') || []));
  formData.append("skills", JSON.stringify(data.skills?.split(',') || []));

  // ✅ Append old format day-wise availability (optional, backward compatibility)
  if (typeof data.availability === "object") {
    Object.entries(data.availability).forEach(([day, obj]) => {
      formData.append(`availability[${day}]`, obj.enabled);
      obj.timeSlots?.forEach((slot, index) => {
        formData.append(`timeSlots[${day}][${index}][start]`, slot.start);
        formData.append(`timeSlots[${day}][${index}][end]`, slot.end);
      });
    });
  }

  // ✅ Append modern timeSlots as full JSON
  if (typeof data.timeSlots === "object") {
    formData.append("timeSlots", JSON.stringify(data.timeSlots));
  }

  try {
    const res = await axios.post(
      "https://api.parrotconsult.com/api/v1/consultant/registerasconsultant",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Form submitted successfully:", res.data);

    setIsLoading(false);
    showSuccessToast("Form submitted successfully")
    reset(); // Clear the form
    setTimeout(() => {
    window.location.href = "/login&signup";
    }, 1000);
  } catch (error) {
    console.error("❌ Form submission error:", error.response?.data || error.message);
    showErrorToast("Form submission, please contact us")
    setIsLoading(false);
  }
};



const validateAvailability = () => {
  const hasAvailability = Object.values(availability).some(day => 
    day.enabled && day.timeSlots.length > 0
  );
  return hasAvailability || 'Please select at least one day with time slots';
};

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setValue('profilePicture', file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file.name);
      setValue('resume', file);
    }
  };
  const handlePanUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPanFile(file.name);
    setValue('panCard', file);
  }
};

const handleAadhaarUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setAadhaarFile(file.name);
    setValue('aadhaarCard', file);
  }
};


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
   <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
           <ToastContainer
  position="top-right"
  autoClose={4000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  
/>
 <div className="min-h-screen bg-gradient-to-br from-[#0e5f44] via-[#143d35] to-[#26794f] p-4">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#26794f] rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-white">PARROT CONSULT</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Become a Consultant</h2>
          <p className="text-green-100">Join our platform and start your consulting journey</p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8"
          variants={itemVariants}
        >
          <div className="space-y-8">
            
            {/* Basic Details Section */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-[#143d35] mb-6 border-b-2 border-[#26794f] pb-2">
                Basic Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#143d35] font-medium">
                    <User size={18} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Full name is required' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#143d35] font-medium">
                    <Mail size={18} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#143d35] font-medium">
                    <Phone size={18} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit phone number'
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#143d35] font-medium">
                    <Lock size={18} />
                    Password *
                  </label>
                  <input
                    type="password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
                    placeholder="Create a strong password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2 mt-6">
                <label className="flex items-center gap-2 text-[#143d35] font-medium">
                  <MapPin size={18} />
                  Complete Address *
                </label>
                <textarea
                  {...register('address', { required: 'Address is required' })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors resize-none"
                  placeholder="Enter your complete address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Profile Picture Upload */}
              <div className="space-y-2 mt-6">
                <label className="flex items-center gap-2 text-[#143d35] font-medium">
                  <Camera size={18} />
                  Upload Profile Picture *
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 border-2 border-dashed border-[#26794f] rounded-lg flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={24} className="text-[#26794f]" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className=""
                      id="profile-upload"
                      {...register('profilePicture', { required: 'Profile picture is required' })}
                    />
                    <label
                      htmlFor="profile-upload"
                      className="bg-[#26794f] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#0e5f44] transition-colors flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Choose Image
                    </label>
                  </div>
                </div>
                {errors.profilePicture && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.profilePicture.message}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Professional Information Section */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-[#143d35] mb-6 border-b-2 border-[#26794f] pb-2">
                Professional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Years of Experience */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#143d35] font-medium">
                    <Briefcase size={18} />
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('experience', { 
                      required: 'Years of experience is required',
                      min: {
                        value: 0,
                        message: 'Experience cannot be negative'
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
                    placeholder="Enter years of experience"
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                {/* Consulting Category */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#143d35] font-medium">
                    <Tag size={18} />
                    Consulting Category *
                  </label>
                  <select
                    {...register('category', { 
                      required: 'Consulting category is required',
                      validate: value => value !== 'Primary Consulting Category' || 'Please select a category'
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
                  >
                    {consultingCategories.map((category, index) => (
                      <option key={index} value={category} disabled={index === 0}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Specialized Services */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#143d35] font-medium">
                    <Tag size={18} />
                    Specialized Services *
                  </label>
                  <input
                    type="text"
                    {...register('specializedServices', { required: 'Specialized services is required' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
                    placeholder="e.g., Digital Marketing, Web Development"
                  />
                  {errors.specializedServices && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.specializedServices.message}
                    </p>
                  )}
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#143d35] font-medium">
                    <IndianRupee size={18} />
                    Hourly Rate *
                  </label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#26794f]" />
                    <input
                      type="number"
                      min="0"
                      {...register('hourlyRate', { 
                        required: 'Hourly rate is required',
                        min: {
                          value: 1,
                          message: 'Hourly rate must be greater than 0'
                        }
                      })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
                      placeholder="Enter hourly rate"
                    />
                  </div>
                  {errors.hourlyRate && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.hourlyRate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Education Details Section */}
<motion.div variants={itemVariants}>
  <h3 className="text-2xl font-bold text-[#143d35] mb-6 border-b-2 border-[#26794f] pb-2">
    Education Details
  </h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Highest Qualification */}
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[#143d35] font-medium">
        <GraduationCap size={18} />
        Highest Qualification *
      </label>
      <select
        {...register('highestQualification', { 
          required: 'Highest qualification is required',
          validate: value => value !== "Select Qualification" || 'Please select your qualification'
        })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
      >
        <option value="Select Qualification" disabled>Select Qualification</option>
        {highestQualification.map((qualification, index) => (
          <option key={index} value={qualification}>
            {qualification}
          </option>
        ))}
      </select>
      {errors.highestQualification && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={16} />
          {errors.highestQualification.message}
        </p>
      )}
    </div>

    {/* Field of Study */}
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[#143d35] font-medium">
        <BookOpen size={18} />
        Field of Study *
      </label>
      <select
        {...register('fieldOfStudy', { 
          required: 'Field of study is required',
          validate: value => value !== "Select Field" || 'Please select your field of study'
        })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
      >
        <option value="Select Field" disabled>Select Field</option>
        {fieldOfStudy.map((field, index) => (
          <option key={index} value={field}>
            {field}
          </option>
        ))}
      </select>
      {errors.fieldOfStudy && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={16} />
          {errors.fieldOfStudy.message}
        </p>
      )}
    </div>

    {/* University/Institute Name */}
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[#143d35] font-medium">
        <School size={18} />
        University / Institute Name *
      </label>
      <input
        type="text"
        {...register('universityName', { required: 'University/Institute name is required' })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
        placeholder="Enter university or institute name"
      />
      {errors.universityName && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={16} />
          {errors.universityName.message}
        </p>
      )}
    </div>

    {/* Graduation/Completion Year */}
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[#143d35] font-medium">
        <Calendar size={18} />
        Graduation / Completion Year *
      </label>
      <input
        type="number"
        min="1970"
        max={new Date().getFullYear()}
        {...register('graduationYear', { 
          required: 'Graduation year is required',
          min: {
            value: 1970,
            message: 'Please enter a valid year'
          },
          max: {
            value: new Date().getFullYear(),
            message: 'Year cannot be in the future'
          }
        })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
        placeholder="e.g., 2020"
      />
      {errors.graduationYear && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={16} />
          {errors.graduationYear.message}
        </p>
      )}
    </div>
  </div>
</motion.div>

{/* Skills & Certifications Section */}
<motion.div variants={itemVariants}>
  <h3 className="text-2xl font-bold text-[#143d35] mb-6 border-b-2 border-[#26794f] pb-2">
    Skills & Certifications
  </h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Skills */}
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[#143d35] font-medium">
        <Award size={18} />
        Skills *
      </label>
      <textarea
        {...register('skills', { required: 'Skills are required' })}
        rows={4}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors resize-none"
        placeholder="List your key skills (e.g., Project Management, Data Analysis, Leadership, etc.)"
      />
      {errors.skills && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={16} />
          {errors.skills.message}
        </p>
      )}
    </div>

    {/* Languages */}
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[#143d35] font-medium">
        <Languages size={18} />
        Languages *
      </label>
      <select
        {...register('languages', { 
          required: 'Language selection is required',
          validate: value => value !== "Select Languages" || 'Please select your languages'
        })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none transition-colors"
        multiple
      >
        <option value="Select Languages" disabled>Select Languages (Hold Ctrl/Cmd for multiple)</option>
        {languages.map((language, index) => (
          <option key={index} value={language}>
            {language}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-600">Hold Ctrl (Windows) or Cmd (Mac) to select multiple languages</p>
      {errors.languages && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={16} />
          {errors.languages.message}
        </p>
      )}
    </div>
  </div>

  {/* Certificates Upload */}
  <div className="space-y-2 mt-6">
    <label className="flex items-center gap-2 text-[#143d35] font-medium">
      <FileText size={18} />
      Upload Certificates *
    </label>
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              // Check file size (5MB = 5 * 1024 * 1024 bytes)
              if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                e.target.value = '';
                setCertificateFile(null);
                return;
              }
              setCertificateFile(file.name);
              setValue('certificates', file);
            }
          }}
          className=""
          id="certificates-upload"
          {...register('certificates', { required: 'Certificates upload is required' })}
        />
        <label
          htmlFor="certificates-upload"
          className="w-full bg-gray-50 border-2 border-dashed border-[#26794f] rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <Upload size={20} className="text-[#26794f]" />
          <span className="text-[#143d35]">
            {certificateFile ? certificateFile : 'Click to upload certificates (PDF only, max 5MB)'}
          </span>
        </label>
      </div>
    </div>
    <p className="text-sm text-gray-600 flex items-center gap-1">
      <AlertCircle size={14} />
      Please combine all certificates into a single PDF file (maximum 5MB)
    </p>
    {errors.certificates && (
      <p className="text-red-500 text-sm flex items-center gap-1">
        <AlertCircle size={16} />
        {errors.certificates.message}
      </p>
    )}
  </div>
</motion.div>

{/* Weekly Availability Section */}
<motion.div variants={itemVariants}>
  <h3 className="text-2xl font-bold text-[#143d35] mb-6 border-b-2 border-[#26794f] pb-2">
    Weekly Availability
  </h3>
  
  <div className="space-y-4">
   {weekDays.map((day) => (
  <div key={day} className="border-2 border-gray-200 rounded-lg p-4">
    {/* Day Checkbox */}
    <div className="flex items-center gap-3 mb-4">
      <input
        type="checkbox"
        id={`day-${day.toLowerCase()}`}
        {...register(`availability.${day.toLowerCase()}.enabled`)}
        onChange={(e) => {
          if (!e.target.checked) {
            setAvailability((prev) => ({
              ...prev,
              [day.toLowerCase()]: { enabled: false, timeSlots: [] },
            }));
          } else {
            setAvailability((prev) => ({
              ...prev,
              [day.toLowerCase()]: { enabled: true, timeSlots: [{ start: "", end: "" }] },
            }));
          }
        }}
        className="w-5 h-5 text-[#26794f] focus:ring-[#26794f] rounded"
      />
      <label
        htmlFor={`day-${day.toLowerCase()}`}
        className="text-lg font-semibold text-[#143d35] cursor-pointer"
      >
        {day}
      </label>
    </div>

    {/* Time Slots */}
    {availability[day.toLowerCase()]?.enabled && (
      <div className="ml-8 space-y-3">
        {availability[day.toLowerCase()].timeSlots.map((slot, index) => (
          <div key={index} className="flex items-center gap-3 flex-wrap">
            {/* Start Time */}
            <div className="flex items-center gap-2">
              <input
                type="time"
                {...register(`timeSlots.${day}.${index}.start`)}
                value={slot.start}
                onChange={(e) =>
                  updateTimeSlot(day.toLowerCase(), index, "start", e.target.value)
                }
                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none"
              />
              <Clock size={18} className="text-[#26794f]" />
            </div>

            <span className="text-gray-500 font-medium">to</span>

            {/* End Time */}
            <div className="flex items-center gap-2">
              <input
                type="time"
                {...register(`timeSlots.${day}.${index}.end`)}
                value={slot.end}
                onChange={(e) =>
                  updateTimeSlot(day.toLowerCase(), index, "end", e.target.value)
                }
                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#26794f] focus:outline-none"
              />
              <Clock size={18} className="text-[#26794f]" />
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeTimeSlot(day.toLowerCase(), index)}
              className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add Time Slot Button */}
        <button
          type="button"
          onClick={() => addTimeSlot(day.toLowerCase())}
          className="text-[#26794f] hover:text-[#0e5f44] font-medium text-sm flex items-center gap-1 transition-colors"
        >
          <Plus size={16} />
          Add time slot
        </button>
      </div>
    )}
  </div>
))}

  </div>

  {/* Validation Message */}
  {errors.availability && (
    <p className="text-red-500 text-sm flex items-center gap-1 mt-4">
      <AlertCircle size={16} />
      Please select at least one day with time slots
    </p>
  )}
</motion.div>

              {/* Resume Upload */}
              <div className="space-y-2 mt-6">
                <label className="flex items-center gap-2 text-[#143d35] font-medium">
                  <FileText size={18} />
                  Upload CV / Resume *
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className=""
                      id="resume-upload"
                      {...register('resume', { required: 'Resume is required' })}
                    />
                    <label
                      htmlFor="resume-upload"
                      className="w-full bg-gray-50 border-2 border-dashed border-[#26794f] rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload size={20} className="text-[#26794f]" />
                      <span className="text-[#143d35]">
                        {resumeFile ? resumeFile : 'Click to upload CV/Resume (PDF, DOC, DOCX)'}
                      </span>
                    </label>
                  </div>
                </div>
                {errors.resume && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.resume.message}
                  </p>
                )}
              </div>
            </motion.div>
{/* Document Verification Section */}
<motion.div variants={itemVariants}>
  <h3 className="text-2xl font-bold text-[#143d35] mb-6 border-b-2 border-[#26794f] pb-2">
    Document Verification (Required)
  </h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Aadhaar Card Upload */}
   <div className="space-y-2 mt-6">
  <label className="flex items-center gap-2 text-[#143d35] font-medium">
    <FileText size={18} />
    Upload Aadhaar Card *
  </label>
  <div className="flex items-center gap-4">
    <div className="flex-1">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleAadhaarUpload}
        className=""
        id="aadhaar-upload"
        {...register('aadhaarCard', { required: 'Aadhaar card is required' })}
      />
      <label
        htmlFor="aadhaar-upload"
        className="w-full bg-gray-50 border-2 border-dashed border-[#26794f] rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
      >
        <Upload size={20} className="text-[#26794f]" />
        <span className="text-[#143d35]">
          {aadhaarFile ? aadhaarFile : 'Click to upload Aadhaar Card (PDF, JPG, PNG)'}
        </span>
      </label>
    </div>
  </div>
  {errors.aadhaarCard && (
    <p className="text-red-500 text-sm flex items-center gap-1">
      <AlertCircle size={16} />
      {errors.aadhaarCard.message}
    </p>
  )}
</div>


    {/* PAN Card Upload */}
 <div className="space-y-2 mt-6">
  <label className="flex items-center gap-2 text-[#143d35] font-medium">
    <FileText size={18} />
    Upload PAN Card *
  </label>
  <div className="flex items-center gap-4">
    <div className="flex-1">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handlePanUpload}
        className=""
        id="pan-upload"
        {...register('panCard', { required: 'PAN card is required' })}
      />
      <label
        htmlFor="pan-upload"
        className="w-full bg-gray-50 border-2 border-dashed border-[#26794f] rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
      >
        <Upload size={20} className="text-[#26794f]" />
        <span className="text-[#143d35]">
          {panFile ? panFile : 'Click to upload PAN Card (PDF, JPG, PNG)'}
        </span>
      </label>
    </div>
  </div>
  {errors.panCard && (
    <p className="text-red-500 text-sm flex items-center gap-1">
      <AlertCircle size={16} />
      {errors.panCard.message}
    </p>
  )}
</div>

  </div>

  {/* Important Note */}
  <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
    <div className="flex items-start gap-2">
      <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
      <div>
        <h4 className="font-semibold text-yellow-800">Important Note</h4>
        <p className="text-yellow-700 text-sm mt-1">
          Please ensure that your documents are clear, readable, and valid. 
          These documents will be used for identity verification and compliance purposes.
        </p>
      </div>
    </div>
  </div>
</motion.div>
            {/* Terms & Agreements */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-[#143d35] mb-6 border-b-2 border-[#26794f] pb-2">
                Terms & Agreements
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    {...register('termsAccepted', { required: 'You must accept the terms and conditions' })}
                    value="true"
                    className="w-4 h-4 mt-1 text-[#26794f] focus:ring-[#26794f]"
                  />
                  <label className="text-[#143d35]">
                    I Accept Consultant Terms & Conditions *
                  </label>
                </div>
                
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    {...register('profileVisibility', { required: 'You must consent to profile visibility' })}
                    value="true"
                    className="w-4 h-4 mt-1 text-[#26794f] focus:ring-[#26794f]"
                  />
                  <label className="text-[#143d35]">
                    Consent for Profile Visibility on Platform *
                  </label>
                </div>
              </div>
              
              {(errors.termsAccepted || errors.profileVisibility) && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                  <AlertCircle size={16} />
                  Please accept all terms and conditions
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
           <motion.div
      className="pt-6"
      variants={itemVariants}
    >
      <motion.button
        type="submit"
        onClick={handleSubmit}
        disabled={isLoading}
        className={`
          w-full py-4 px-8 rounded-lg font-semibold text-lg shadow-lg 
          transition-all duration-300 flex items-center justify-center gap-2
          ${isLoading 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-[#26794f] to-[#0e5f44] hover:shadow-xl'
          } 
          text-white
        `}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 size={20} />
            </motion.div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            <span>Become a Consultant</span>
          </>
        )}
      </motion.button>
    </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>

   </form>
  );
};

export default ConsultantSignupForm;
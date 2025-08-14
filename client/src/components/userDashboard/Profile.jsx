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
  AlertCircle,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { profileUpdate } from "../../apis/userApi";
import { showErrorToast } from "../../util/Notification";
import { ToastContainer } from "react-toastify";

const Profile = () => {

  const [editing, setEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile ] = useState(null);
  

 const onSubmit = async (data) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = storedUser?.role;

 
  // ✅ Create a FormData object to send
const formData = new FormData();

Object.entries(data).forEach(([key, value]) => {
  if (key === "resume" && value instanceof FileList && value.length > 0) {
    formData.append("resume", value[0]);
  } else {
    formData.append(key, value);
  }
});

if(imageFile){
  formData.append("profileImage", imageFile);
}
  
  // ✅ Send FormData to API
  const response = await profileUpdate(formData);
 showErrorToast(response)
  
  // ✅ Save updated user object (not FormData) to localStorage
  const updatedUser = response?.user;

  if (updatedUser) {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditing(false);
    window.location.reload();
  } else {
    console.error("No user data returned from update API.");
  }
};


  let userData = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      userData = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
  }

  const [formData, setFormData] = useState({
    // Basic Info
    email: String(userData?.email || ""),
    fullName: String(userData?.fullName || ""),
    phone: String(userData?.phone || ""),
    location: String(userData?.location || ""),
    profileImage: String(userData?.profileImage || ""),

    // KYC Info
    aadharNumber: String(userData?.kycVerify?.aadharNumber || ""),
    aadharURL: String(userData?.kycVerify?.aadharURL || ""),
    panNumber: String(userData?.kycVerify?.panNumber || ""),
    panURL: String(userData?.kycVerify?.panURL || ""),

    // Consultant Profile Info
    sessionFee:
      userData?.consultantRequest?.consultantProfile?.sessionFee?.toString() ||
      "",
    daysPerWeek:
      userData?.consultantRequest?.consultantProfile?.daysPerWeek || "",
    days:
      userData?.consultantRequest?.consultantProfile?.days?.join(", ") || "",
    availableTimePerDay:
      userData?.consultantRequest?.consultantProfile?.availableTimePerDay || "",
    qualification:
      userData?.consultantRequest?.consultantProfile?.qualification || "",
    fieldOfStudy:
      userData?.consultantRequest?.consultantProfile?.fieldOfStudy || "",
    university:
      userData?.consultantRequest?.consultantProfile?.university || "",
    graduationYear: String(
      userData?.consultantRequest?.consultantProfile?.graduationYear || ""
    ),
    keySkills:
      userData?.consultantRequest?.consultantProfile?.keySkills?.join(", ") ||
      "",
    shortBio: userData?.consultantRequest?.consultantProfile?.shortBio || "",
    languages:
      userData?.consultantRequest?.consultantProfile?.languages?.join(", ") ||
      "",
    yearsOfExperience: String(
      userData?.consultantRequest?.consultantProfile?.yearsOfExperience || ""
    ),
    category: userData?.consultantRequest?.consultantProfile?.category || "",

    // Documents
    resume: userData?.consultantRequest?.documents?.resume || "",
    otherDocuments: userData?.consultantRequest?.documents?.other || [],

    // Flags
    aadharVerified: Boolean(userData?.aadharVerified || false),
    profileHealth: String(
      userData?.consultantRequest?.consultantProfile?.profileHealth || ""
    ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      profileImage: formData.profileImage,

      aadharNumber: formData.aadharNumber,
      aadharURL: formData.aadharURL,
      panNumber: formData.panNumber,
      panURL: formData.panURL,

      sessionFee: formData.sessionFee,
      daysPerWeek: formData.daysPerWeek,
      days: formData.days,
      availableTimePerDay: formData.availableTimePerDay,
      qualification: formData.qualification,
      fieldOfStudy: formData.fieldOfStudy,
      university: formData.university,
      graduationYear: formData.graduationYear,
      keySkills: formData.keySkills,
      shortBio: formData.shortBio,
      languages: formData.languages,
      yearsOfExperience: formData.yearsOfExperience,
      category: formData.category,

      resume: formData.resume,
      profileHealth: formData.profileHealth,
    },
  });

  const [profileImage, setProfileImage] = useState(
    userData?.profileImage || ""
  );
  


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setImageFile(file); 
    const url = URL.createObjectURL(file);
    setProfileImage(url);
    
    setIsUploading(false);
  };

  const handleCancel = () => {
    window.location.reload()
    setEditing(false);
  };

  const DisplayField = ({
    icon: Icon,
    label,
    value,
    color = "text-gray-700",
  }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon size={18} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-base font-semibold ${color}`}>
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-4xl mx-auto overflow-hidden"
    >
       <ToastContainer />
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Profile Information
          </h2>
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col ">
                    <label className="form-label">
                      <User size={16} /> Full Name
                    </label>
                    <input
                      {...register("fullName", { required: true })}
                      className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label">
                      <Mail size={16} /> Email Address
                    </label>
                    <input
                      {...register("email", { required: true })}
                      className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      type="email"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label">
                      <Phone size={16} /> Phone Number
                    </label>
                    <input
                      {...register("phone", { required: true })}
                      className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      type="tel"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="form-label">
                      <MapPin size={16} /> Location
                    </label>
                    <input
                      {...register("location")}
                      className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                    />
                  </div>
                </div>

                {userData?.role === "consultant" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 mt-6">
                    <div className=" flex flex-col">
                      <label className="form-label">
                        <Edit3 size={16} /> Session Fee (INR)
                      </label>
                      <input
                        {...register("sessionFee")}
                        type="number"
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <Calendar size={16} /> Days per Week
                      </label>
                      <input
                        {...register("daysPerWeek")}
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <User size={16} /> Qualification
                      </label>
                      <input
                        {...register("qualification")}
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <User size={16} /> Field of Study
                      </label>
                      <input
                        {...register("fieldOfStudy")}
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <MapPin size={16} /> University
                      </label>
                      <input
                        {...register("university")}
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <Calendar size={16} /> Graduation Year
                      </label>
                      <input
                        {...register("graduationYear")}
                        type="number"
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <Edit3 size={16} /> Short Bio
                      </label>
                      <textarea
                        {...register("shortBio")}
                        rows={2}
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white resize-none"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <User size={16} /> Languages
                      </label>
                      <input
                        {...register("languages")}
                        placeholder="English, Hindi"
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <User size={16} /> Experience (Years)
                      </label>
                      <input
                        {...register("yearsOfExperience")}
                        type="number"
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <Calendar size={16} /> Available Days
                      </label>
                      <input
                        {...register("days")}
                        placeholder="Monday, Wednesday"
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <Calendar size={16} /> Available Time Per Day
                      </label>
                      <input
                        {...register("availableTimePerDay")}
                        placeholder="6 PM - 9 PM"
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <User size={16} /> Key Skills
                      </label>
                      <input
                        {...register("keySkills")}
                        placeholder="React, Node.js"
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <User size={16} /> Resume Link
                      </label>
                      <input
                        {...register("resume")}
                        type="file"
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>

                    <div className=" flex flex-col">
                      <label className="form-label">
                        <User size={16} /> Category
                      </label>
                      <input
                        {...register("category")}
                        placeholder="Web Development"
                        className=" outline-none border rounded-sm p-1 focus:border-green-900 focus:bg-gray-400 focus:text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <AnimatePresence mode="wait">
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
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Save size={18} />
                        Save Changes
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </form>
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

                {userData?.role === "consultant" && (
                  <div className="space-y-4 pt-4 border-t border-gray-100 mt-4">
                    <DisplayField
                      icon={Edit3}
                      label="Session Fee (INR)"
                      value={formData.sessionFee}
                      color="text-gray-700"
                    />
                    <DisplayField
                      icon={Calendar}
                      label="Days per Week"
                      value={formData.daysPerWeek}
                      color="text-gray-700"
                    />
                    <DisplayField
                      icon={User}
                      label="Qualification"
                      value={formData.qualification}
                      color="text-gray-700"
                    />
                    <DisplayField
                      icon={User}
                      label="Field of Study"
                      value={formData.fieldOfStudy}
                      color="text-gray-700"
                    />
                    <DisplayField
                      icon={MapPin}
                      label="University"
                      value={formData.university}
                      color="text-gray-700"
                    />
                    <DisplayField
                      icon={Calendar}
                      label="Graduation Year"
                      value={formData.graduationYear}
                      color="text-gray-700"
                    />
                    <DisplayField
                      icon={User}
                      label="Languages"
                      value={formData.languages}
                      color="text-gray-700"
                    />
                    <DisplayField
                      icon={User}
                      label="Experience (Years)"
                      value={formData.yearsOfExperience}
                      color="text-gray-700"
                    />
                    <DisplayField
                      icon={User}
                      label="Category"
                      value={formData.category}
                      color="text-gray-700"
                    />
                    {formData.shortBio && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Short Bio
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {formData.shortBio}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      {!editing && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onClick={() => setEditing(true)}
          className=" relative mt-10 lg:left-[75%] px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Edit3 size={18} />
          Edit Profile
        </motion.button>
      )}
    </motion.div>
  );
};

export default Profile;

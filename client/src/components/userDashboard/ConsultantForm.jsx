import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileDown, IndianRupee, Calendar, GraduationCap, School, BriefcaseBusiness, Tag } from 'lucide-react';
import {FaUser} from 'react-icons/fa'
import {AadharPanVerification,  getConsultantStatus, submitConsultantApplication} from '../../apis/userApi.js'
import { showErrorToast, showSuccessToast } from '../../util/Notification.jsx';
import { TbUpload } from "react-icons/tb";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ConsultantForm = () => {
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarPhoto, setAadhaarPhoto] = useState();
  const [panPhoto, setPanPhoto] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formStatus, setFormStatus] = useState('pending');
  const { register, handleSubmit , reset  } = useForm();
console.log(formStatus);

useEffect(() => {
  const fetchData = async () => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);

      // Example: set Aadhaar verified flag
      if (user.aadharVerified) {
        setAadhaarVerified(user.aadharVerified);
      }

      if (user.consultantRequest?.status === "pending") {
        setFormSubmitted(true);
      }

      try {
        const response = await getConsultantStatus();
        setFormStatus(response);
      } catch (err) {
        console.error("Error fetching consultant status:", err);
      }
    }
  };

  fetchData();
}, []);


 



 const onSubmit = async (data) => {
  console.log(data);
  
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "resume" && value instanceof FileList && value.length > 0) {
        formData.append("resume", value[0]); 
      } else {
        formData.append(key, value);
      }
    });


  
  
   const response = await submitConsultantApplication(formData)
   console.log('response' , response);
   
   if (response.status === 200) {
    showSuccessToast('consultant Application form submited successfully')
    reset();
    let user = JSON.parse(localStorage.getItem("user"));
    user.consultantRequest.status = "pending";
    localStorage.setItem("user", JSON.stringify(user));
   }

  };

  useEffect(() => {
  return () => {
    aadhaarPhoto && URL.revokeObjectURL(aadhaarPhoto);
    panPhoto && URL.revokeObjectURL(panPhoto);
  };
}, [aadhaarPhoto, panPhoto]);

const handleAadharPanVerification = async()=>{
  const payload = new FormData()
  payload.append('aadhaarCard' , aadhaarPhoto)
  payload.append('panCard' , panPhoto)
  const response = await AadharPanVerification(payload)
  console.log(' response upload aadhar pan' , response);

  if(response.status === 200){
    setAadhaarVerified(true)
    showSuccessToast('aadhar and pan uploaded successfully')
  }else{
    showErrorToast(response.response.data.message)
  }
}

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-md mt-6">
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
      <h2 className="text-2xl font-semibold text-[#0f5f42] mb-6">Become Consultant - Application Form</h2>

     {!aadhaarVerified && (
  <div className="space-y-4 mb-8">
    <div className="flex flex-col md:flex-row justify-around gap-6">
      
      {/* Aadhaar Upload */}
      <div className="flex flex-col items-center">
        <label
          htmlFor="aadharCard"
          className="border-dotted border-2 bg-green-700/20 cursor-pointer border-green-950 flex justify-center px-20 py-10 rounded-2xl"
        >
          <span className="flex flex-col items-center text-green-950">
            <TbUpload />
            Aadhaar Photo
          </span>
        </label>
        <input
          type="file"
          accept="pdf"
          onChange={(e) => setAadhaarPhoto(e.target.files[0])}
          className="hidden"
          id="aadharCard"
        />

        {/* Preview Aadhaar */}
        {aadhaarPhoto && (
          <img
            src={URL.createObjectURL(aadhaarPhoto)}
            alt="Aadhaar Preview"
            className="mt-4 w-40 h-40 object-cover rounded-xl shadow"
          />
        )}
      </div>

      {/* PAN Upload */}
      <div className="flex flex-col items-center">
        <label
          htmlFor="PANCard"
          className="border-dotted border-2 bg-green-700/20 cursor-pointer border-green-950 flex justify-center px-20 py-10 rounded-2xl"
        >
          <span className="flex flex-col items-center text-green-950">
            <TbUpload />
            PAN Card Photo
          </span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPanPhoto(e.target.files[0])}
          className="hidden"
          id="PANCard"
        />

        {/* Preview PAN */}
        {panPhoto && (
          <img
            src={URL.createObjectURL(panPhoto)}
            alt="PAN Preview"
            className="mt-4 w-40 h-40 object-cover rounded-xl shadow"
          />
        )}
      </div>
    </div>

    <button
      onClick={handleAadharPanVerification}
      className="bg-[#2a7d51] hover:bg-[#0f5f42] text-white px-4 py-2 rounded mt-6"
    >
      Verify Aadhaar & PAN
    </button>
  </div>
)}


      {aadhaarVerified && !formSubmitted && (formStatus === 'pending' || formStatus === null) && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div>
            <h3 className="text-xl font-semibold border-b border-[#0f5f42] pb-2 mb-4 text-[#103a35]">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Years of Experience *</label>
                <input type='Number' {...register("experience")} placeholder="Enter years of experience" className="border rounded w-full px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Consulting Category *</label>
                <select {...register("category")} className="border rounded w-full px-3 py-2">
                  <option value="">Select category</option>
                  <option value="strategy">Business Strategy</option>
                  <option value="marketing">Marketing</option>
                  <option value="tech">Technology</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Specialized Services *</label>
                <input {...register("services")} placeholder="e.g., Digital Marketing, Web Development" className="border rounded w-full px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Hourly Rate *</label>
                <input type='Number' {...register("rate")} placeholder="Enter hourly rate" className="border rounded w-full px-3 py-2" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold border-b border-[#0f5f42] pb-2 mb-4 text-[#103a35]">Education Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Highest Qualification *</label>
                <select {...register("qualification")} className="border rounded w-full px-3 py-2">
                  <option value="">Select qualification</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">Ph.D.</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Field of Study *</label>
                <input {...register("field")} placeholder="e.g., Business Administration" className="border rounded w-full px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">University / Institute Name *</label>
                <input {...register("university")} placeholder="Enter university or institute name" className="border rounded w-full px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Graduation / Completion Year *</label>
                <input type='Number' {...register("graduationYear")} placeholder="e.g., 2020" className="border rounded w-full px-3 py-2" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold border-b border-[#0f5f42] pb-2 mb-4 text-[#103a35]">Resume Upload</h3>
            <input type="file" {...register("resume")} className="border border-dashed w-full px-3 py-2" />
          </div>

          <button type="submit" className="bg-[#c86336] hover:bg-[#a74e29] text-white px-4 py-2 rounded">
            Submit Application
          </button>
        </form>
      )}

     {formStatus === 'pending' && (
  <div className="bg-green-50 border border-green-300 text-green-800 rounded-xl p-6 text-center shadow-md animate-fade-in mt-6">
    <h3 className="text-2xl font-bold mb-2 text-[#0f5f42]">Application Submitted Successfully</h3>
    <p className="text-lg">Thank you for applying! Our team is reviewing your profile. You’ll hear from us soon.</p>
    <div className="mt-6 text-sm text-gray-500">
      Status: <span className="font-semibold text-[#0f5f42]">Pending Verification</span>
    </div>
  </div>
)}

{formStatus === 'approved' && (
  <div className="bg-blue-50 border border-blue-300 text-blue-800 rounded-xl p-6 text-center shadow-md animate-fade-in mt-6">
    <h3 className="text-2xl font-bold mb-2 text-[#1d4ed8]">Application Approved</h3>
    <p className="text-lg">Congratulations! Your application has been approved. You may now access all features.</p>
    <div className="mt-6 text-sm text-gray-500">
      Status: <span className="font-semibold text-[#1d4ed8]">Approved</span>
    </div>
  </div>
)}

{formStatus === 'rejected' && (
  <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-6 text-center shadow-md animate-fade-in mt-6">
    <h3 className="text-2xl font-bold mb-2 text-[#b91c1c]">Application Rejected</h3>
    <p className="text-lg">Unfortunately, your application was not approved at this time. Please review and reapply later.</p>
    <div className="mt-6 text-sm text-gray-500">
      Status: <span className="font-semibold text-[#b91c1c]">Rejected</span>
    </div>
  </div>
)}

    </div>
  );
};

export default ConsultantForm;
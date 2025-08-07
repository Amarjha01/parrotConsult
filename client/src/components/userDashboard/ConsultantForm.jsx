import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileDown, IndianRupee, Calendar, GraduationCap, School, BriefcaseBusiness, Tag } from 'lucide-react';
import {FaUser} from 'react-icons/fa'
import {getAadharVerify, submitConsultantApplication} from '../../apis/userApi.js'
import { showSuccessToast } from '../../util/Notification.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ConsultantForm = () => {
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formStatus, setFormStatus] = useState('pending');
  const { register, handleSubmit , reset  } = useForm();
console.log(formStatus);

useEffect(()=>{
  const userData = localStorage.user
  
     if (userData) {
      setAadhaarVerified(JSON.parse(userData).aadharVerified)
     }
      if (userData) {
        let user = JSON.parse(userData )
        console.log(user);
        
        if (user.consultantRequest.status === 'pending') {
          setFormSubmitted(true)
        }
        setFormStatus(user.consultantRequest.status)
      }

},[])

 
const handleVerification = async () => {
  if (aadhaarNumber.length === 12 && panNumber.length === 10) {
    const payload = {
    aadharVerified: true,
     kycVerify:{
      aadharNumber: aadhaarNumber,
      panNumber: panNumber,
  },
    };

    try {
      const response = await getAadharVerify(payload);
      console.log("Verification successful:", response);
      
      
      setAadhaarVerified(true);
      // Optional: update localStorage
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

    } catch (error) {
      console.error("Verification failed:", error);
    }
  } else {
    alert("Please enter valid Aadhaar and PAN numbers.");
  }
};


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


      // console.log("FormData preview:");
      // for (let [key, val] of formData.entries()) {
      //   console.log(`${key}:`, val);
      // }
  
  
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

      {!aadhaarVerified &&  (
        <div className="space-y-4 mb-8">
          <div>
            <label className="block mb-1 font-medium">Aadhaar Number</label>
            <input
              type="text"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="Enter 12-digit Aadhaar number"
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">PAN Number</label>
            <input
              type="text"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
              placeholder="Enter 10-character PAN number"
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <button
            onClick={handleVerification}
            className="bg-[#2a7d51] hover:bg-[#0f5f42] text-white px-4 py-2 rounded"
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
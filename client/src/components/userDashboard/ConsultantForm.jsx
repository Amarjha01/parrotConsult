import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileDown, IndianRupee, Calendar, GraduationCap, School, BriefcaseBusiness, Tag } from 'lucide-react';
import {FaUser} from 'react-icons/fa'
const ConsultantForm = () => {
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Application submitted successfully");
  };

  const handleVerification = () => {
    if (aadhaarNumber.length === 12 && panNumber.length === 10) {
      setAadhaarVerified(true);
    } else {
      alert('Please enter valid Aadhaar and PAN numbers.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-md mt-6">
      <h2 className="text-2xl font-semibold text-[#0f5f42] mb-6">Become Consultant - Application Form</h2>

      {!aadhaarVerified && (
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

      {aadhaarVerified && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div>
            <h3 className="text-xl font-semibold border-b border-[#0f5f42] pb-2 mb-4 text-[#103a35]">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Years of Experience *</label>
                <input {...register("experience")} placeholder="Enter years of experience" className="border rounded w-full px-3 py-2" />
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
                <input {...register("rate")} placeholder="Enter hourly rate" className="border rounded w-full px-3 py-2" />
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
                <input {...register("graduationYear")} placeholder="e.g., 2020" className="border rounded w-full px-3 py-2" />
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
    </div>
  );
};

export default ConsultantForm;
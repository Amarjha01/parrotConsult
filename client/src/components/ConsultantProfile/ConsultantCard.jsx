import React, { useState } from "react";
import {
  MapPin,
  Clock,
  IndianRupee,
  Languages,
  Star,
  Badge,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const InfoCard = ({ icon, title, value }) => (
  <div className="flex items-start gap-2 bg-white rounded p-2">
    <div className="text-[#348559]">{icon}</div>
    <div className="text-left">
      <div className="font-medium text-gray-800 text-[10px]">{title}</div>
      <div className="text-gray-600 text-xs truncate">{value}</div>
    </div>
  </div>
);

export default function ConsultantCard({ consultant, onBookNow }) {
  
  const {
    fullName,
    primaryCategory = consultant.consultantRequest.consultantProfile.category,
    languageProficiency,
    address = consultant.location,
    profilePicture = consultant.profileImage,
    hourlyRate,
    experience = consultant.consultantRequest.consultantProfile.yearsOfExperience,
    availabilityPerWeek = consultant.consultantRequest.consultantProfile.daysPerWeek,
    _id,
  } = consultant;

  return (
    <div className="relative bg-white w-[280px] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group">
      
      {/* Offer Tag */}
      <div className="absolute -top-1 -right-2 z-10">
        <div className="bg-gradient-to-r from-[#348559] via-[#09533d] to-[#113a39] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg rotate-12 flex items-center gap-1 animate-pulse">
          <Zap size={10} className="text-yellow-300" />
          FREE
        </div>
      </div>
  
      {/* Link-wrapped card content */}
      <Link
        to={`/consultantprofile/${_id}/${name}`}
        className="block"
      >
        <div className="p-4 text-center">
          {/* Profile Image */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <img
                src={profilePicture || "https://i.postimg.cc/bryMmCQB/profile-image.jpg"}
                alt={`${name}'s profile`}
                className="w-[90px] h-[90px] rounded-full object-cover border-2 border-[#348559] shadow-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "https://i.postimg.cc/bryMmCQB/profile-image.jpg";
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#348559] to-[#09533d] rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
  
          {/* Name and Category */}
          <h3 className="text-lg font-bold tracking-wide text-gray-800 mb-1 group-hover:text-[#348559] transition-colors duration-300">
            {fullName}
          </h3>
          <div className="inline-flex items-center gap-1 bg-[#348559]/10 px-2 py-0.5 rounded-full text-xs font-medium text-[#348559]">
            <Badge size={12} />
            {primaryCategory}
          </div>
  
          {/* Detail Grid */}
          <div className="bg-gray-50 rounded-lg p-3 mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <InfoCard icon={<Languages size={14} />} title="Languages" value={languageProficiency?.slice(0, 2).join(", ") || "English"} />
              <InfoCard icon={<Clock size={14} />} title="Available" value={`${availabilityPerWeek || "10"} Days/week`} />
              <InfoCard icon={<MapPin size={14} />} title="Location" value={address?.split(",")[0] || "Remote"} />
              <InfoCard icon={<IndianRupee size={14} />} title="Rate" value={<><s>₹{hourlyRate}/hr</s> FREE</>} />
            </div>
          </div>
  
          {/* Stats */}
          <div className="flex justify-center gap-6 mt-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold bg-gradient-to-r from-[#348559] to-[#09533d] bg-clip-text text-transparent">
                {experience}
              </div>
              <div className="text-gray-600 text-[10px]">Years Exp.</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-yellow-500">
                4.8 <Star size={14} fill="currentColor" />
              </div>
              <div className="text-gray-600 text-[10px]">Rating</div>
            </div>
          </div>
        </div>
      </Link>
  
      {/* Action Buttons */}
      <div className="flex gap-2 p-4 pt-0">
        {/* View Button */}
        <Link
          to={`/consultantprofile/${_id}/${fullName}`}
          className="flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full px-3 py-2 rounded-lg text-[#348559] font-medium border border-[#348559] text-sm hover:bg-[#348559] hover:text-white transition-all duration-200">
            View
          </button>
        </Link>
  
        {/* Book Button */}
        <button
          onClick={(e) => {
            e.preventDefault(); // prevent link if inside
            e.stopPropagation(); // prevent card link
            onBookNow(consultant);
          }}
          className="flex-1 px-3 py-2 rounded-lg text-white text-sm bg-gradient-to-r from-[#348559] via-[#09533d] to-[#113a39] hover:from-[#09533d] hover:to-[#113a39] transition-all duration-200"
        >
          Book
        </button>
      </div>
    </div>
  );
  


}


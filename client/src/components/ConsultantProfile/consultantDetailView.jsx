import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Star,
  Mail,
  Phone,
  BookOpen,
  Award,
  Languages,
  Briefcase,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { viewSingleConsultant } from "../../apis/globalApi";
import BookingPage from "../booking/BookingPage";

export default function ConsultantDetailView() {
  const { id } = useParams();
  const [consultant, setConsultant] = useState();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [getStarted, setGetStarted] = useState(false);

  const handleBookNow = () => {
    setIsBookingOpen(true);
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  useEffect(() => {
    const fetchConsultant = async () => {
      try {
        const response = await viewSingleConsultant(id);
        setConsultant(response.data || {});
      } catch (err) {
        console.error("Error fetching consultant:", err);
      }
    };
    fetchConsultant();
  }, [id]);

  if (!consultant) return <div className="text-center py-10">Loading...</div>;

  const {
    name,
    email,
    phoneNumber,
    address,
    experience,
    profilePicture,
    primaryCategory,
    specializedServices,
    keySkills,
    languageProficiency,
    availabilityPerWeek,
    hourlyRate,
    preferredWorkingHours,
    bookingLeadTime,
    education,
    certificates,
  } = consultant;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-20 py-8">
      {isBookingOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="border border-green-900 rounded-2xl shadow-xl w-full max-w-md md:max-w-lg bg-white/50 backdrop-blur-xl">
            <div className="border-b border-gray-200 p-4 md:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#3b8c60] to-[#207158] rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-[#103e39]">Book a consultation</h1>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <motion.section
                className="bg-gradient-to-r from-[#3b8c60]/5 to-[#207158]/5 rounded-2xl p-3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-lg md:text-xl font-semibold text-[#103e39] mb-4 md:mb-6">How it works</h2>
                <div className="space-y-4 text-sm">
                  {["Choose your consult", "Select date & time", "Let's connect"].map((step, i) => (
                    <div key={i} className="flex items-start space-x-3 md:space-x-4">
                      <div className="w-7 h-7 bg-[#3b8c60] text-white rounded-full flex items-center justify-center font-semibold text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#103e39]">{step}</h3>
                        <p className="text-gray-600">
                          {i === 0 && "Select the consultant who fits best your needs"}
                          {i === 1 && "Pick an available slot that works for you"}
                          {i === 2 && "Meet with your consultant and get the guidance you seek"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setGetStarted(true);
                    setIsBookingOpen(false);
                  }}
                  className="bg-gradient-to-r from-[#3b8c60] to-[#207158] text-white px-5 py-2.5 rounded-full text-base font-semibold shadow-md hover:shadow-xl transition duration-300 hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
<BookingPage 
  isOpen={getStarted}
  onClose={() => setGetStarted(false)}
  consultant={consultant}
/>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <img
            src={profilePicture || "https://i.postimg.cc/bryMmCQB/profile-image.jpg"}
            alt="profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{name}</h2>
            <p className="text-lg text-teal-700 font-semibold mb-2">{primaryCategory}</p>
            <div className="text-gray-600 space-y-1 text-sm md:text-base">
              <p><Mail className="inline w-5 h-5 mr-2 text-teal-600" />{email}</p>
              <p><Phone className="inline w-5 h-5 mr-2 text-teal-600" />*******{phoneNumber?.toString().slice(-3)}</p>
              <p><MapPin className="inline w-5 h-5 mr-2 text-teal-600" />{address}</p>
              <p><Briefcase className="inline w-5 h-5 mr-2 text-teal-600" />{experience} years experience</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-semibold">₹<s>{hourlyRate}</s> FREE</span>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-semibold">Rating: 4.8</span>
              </div>
            </div>
           
          </div>
           <div className="h-14 flex gap-4 flex-col sm:flex-row">
              <button
                onClick={handleBookNow}
                className="bg-teal-700 text-white px-6  rounded-lg hover:bg-teal-800"
              >
                Book Consultation
              </button>
              <button className="border border-teal-700 text-teal-700 px-6  rounded-lg hover:bg-teal-700 hover:text-white">
                Send Message
              </button>
            </div>
        </div>

        {/* Skills and Details */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Specialized Services", icon: <Star />, items: specializedServices, color: "bg-teal-100 text-teal-800" },
            { title: "Key Skills", icon: <Award />, items: keySkills, color: "bg-blue-100 text-blue-800" },
            { title: "Language Proficiency", icon: <Languages />, items: languageProficiency, color: "bg-green-100 text-green-800" },
          ].map(({ title, icon, items, color }, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                {icon}
                {title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(items || []).map((item, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 ${color} rounded-full text-sm font-medium`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Availability */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              Availability
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              <strong>Working Hours:</strong> {preferredWorkingHours || "09:30 - 05:00"}<br />
              <strong>Lead Time:</strong> {bookingLeadTime || "2 day"}<br />
              <strong>Hours/Week:</strong> {availabilityPerWeek || "10"} hours
            </p>
          </div>
        </div>

        {/* Education */}
        {education?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i} className="border-l-4 border-teal-500 pl-4">
                  <h4 className="font-semibold text-gray-800">{edu.qualification}</h4>
                  <p className="text-gray-600">{edu.university}</p>
                  <p className="text-sm text-gray-500">{edu.fieldOfStudy} • {edu.graduationYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {certificates?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              Certificates
            </h3>
            <div className="space-y-3">
              {certificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{cert.name}</span>
                  {cert.fileUrl && (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800 flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

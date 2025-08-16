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
import { useNavigate, useParams } from "react-router-dom";
import { viewSingleConsultant } from "../../../apis/globalApi";
import BookingPage from "../../booking/BookingPage";
import axios from "axios";

export default function ConsultantDetailView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [consultant, setConsultant] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [getStarted, setGetStarted] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const userId = currentUser?._id;
  const role = currentUser?.role;

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  useEffect(() => {
    async function fetchConsultant() {
      try {
        const response = await viewSingleConsultant(id);
        setConsultant(response.data || {});
      } catch (error) {
        console.error("Error fetching consultant:", error);
      }
    }
    fetchConsultant();
  }, [id]);

  if (!consultant) return <div className="text-center py-10">Loading...</div>;

  const {
    fullName,
    email,
    phoneNumber = consultant.phone,
    address = consultant.location,
    experience = consultant.consultantRequest?.consultantProfile?.yearsOfExperience,
    profileImage,
    primaryCategory = consultant.consultantRequest?.consultantProfile?.category,
    shortBio = consultant.consultantRequest?.consultantProfile?.shortBio,
    specializedServices = consultant.consultantRequest?.consultantProfile?.Specialized,
    keySkills = consultant.consultantRequest?.consultantProfile?.keySkills,
    languageProficiency = consultant.consultantRequest?.consultantProfile?.languages,
    hourlyRate = consultant.consultantRequest?.consultantProfile?.sessionFee,
    preferredWorkingHours = consultant.consultantRequest?.consultantProfile?.availableTimePerDay,
    daysPerWeek = consultant.consultantRequest?.consultantProfile?.days,
    HeighestQualification = consultant.consultantRequest?.consultantProfile?.qualification,
    university = consultant.consultantRequest?.consultantProfile?.university,
    fieldOfStudy = consultant.consultantRequest?.consultantProfile?.fieldOfStudy,
    graduationYear = consultant.consultantRequest?.consultantProfile?.graduationYear,
    certificates,
    _id,
  } = consultant;
console.log('Specialized' , specializedServices);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSendMessage = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/chat/${userId}/${_id}`, { withCredentials: true });
      const chatId = resp.data.chat._id;
      navigate(`/chat?otherId=${_id}&role=user&chatId=${chatId}`);
    } catch {
      navigate(`/chat?otherId=${_id}&role=user`);
    }
  };

  const handleBookNow = () => {
    setIsBookingOpen(true);
  };

  return (
    <div className="lg:min-h-screen h-[89vh] px-4 sm:px-6 lg:px-20 py-8 ">
      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="border border-teal-900 rounded-2xl shadow-xl w-full max-w-md md:max-w-lg bg-white/60 backdrop-blur-xl">
            <div className="border-b border-gray-200 p-6 flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-teal-700" />
              <h1 className="text-xl md:text-2xl font-bold text-teal-900">Book a consultation</h1>
            </div>
            <div className="p-6">
              <motion.section
                className="bg-teal-50 rounded-2xl p-4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-lg md:text-xl font-semibold text-teal-900 mb-4 md:mb-6">How it works</h2>
                <ul className="list-decimal list-inside space-y-4 text-gray-700 text-sm">
                  <li>
                    <strong>Choose your consult:</strong> Select the consultant who fits best your needs.
                  </li>
                  <li>
                    <strong>Select date & time:</strong> Pick an available slot that works for you.
                  </li>
                  <li>
                    <strong>Let's connect:</strong> Meet with your consultant and get the guidance you seek.
                  </li>
                </ul>
              </motion.section>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setGetStarted(true);
                    setIsBookingOpen(false);
                  }}
                  className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transition duration-300 hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BookingPage isOpen={getStarted} onClose={() => setGetStarted(false)} consultant={consultant} />

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12 flex flex-col md:flex-row gap-8 items-center md:items-start">
  {/* Profile Image */}
  <img
    src={profileImage || "https://i.postimg.cc/bryMmCQB/profile-image.jpg"}
    alt={fullName}
    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
  />

  {/* Profile Details */}
  <div className="flex-1 min-w-0 max-w-full md:max-w-2xl">
    <h2 className="text-3xl font-bold text-gray-900 mb-3 truncate capitalize">{fullName}</h2>
    <p className="text-xl font-semibold text-teal-700 mb-6 capitalize truncate"> {primaryCategory}</p>

    <div className="text-gray-700 space-y-3 text-base md:text-lg max-w-xl">
      <p className="flex items-center gap-2 truncate">
        <Mail className="w-5 h-5 text-teal-600 flex-shrink-0" />
        <span title={email}>{email}</span>
      </p>
      <p className="flex items-center gap-2 truncate">
        <Phone className="w-5 h-5 text-teal-600 flex-shrink-0" />
        <span title={phoneNumber}>*******{phoneNumber?.toString().slice(-3)}</span>
      </p>
      <p className="flex items-center gap-2 truncate">
        <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
        <span title={address}>{address}</span>
      </p>
      <p className="flex items-center gap-2 truncate">
        <Briefcase className="w-5 h-5 text-teal-600 flex-shrink-0" />
        <span>{experience} years experience</span>
      </p>
    </div>

    <div className="mt-8 flex flex-wrap gap-5 max-w-xl">
      <div className="bg-gray-100 px-6 py-3 rounded-lg font-semibold text-gray-800 shadow-sm flex items-center space-x-2">
        <span className="line-through text-gray-500">₹{hourlyRate}</span>
        <span className="text-green-600">FREE</span>
      </div>
      <div className="bg-gray-100 px-6 py-3 rounded-lg font-semibold text-gray-800 shadow-sm flex items-center space-x-2">
        <Star className="text-yellow-400 w-6 h-6" />
        <span className="text-lg">4.8</span>
      </div>
    </div>
  </div>

  {/* Buttons on Right Side */}
  <div className="flex flex-col gap-4 min-w-[180px]">
    <button
      onClick={handleBookNow}
      className="bg-teal-700 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-teal-800 transition-shadow shadow-md hover:shadow-lg w-full"
    >
      Book Consultation
    </button>
    <button
      onClick={handleSendMessage}
      className="border border-teal-700 text-teal-700 px-6 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 hover:text-white transition-shadow shadow-sm hover:shadow-md w-full"
    >
      Send Message
    </button>
  </div>
</div>


      {/* Short Bio */}
      {shortBio && (
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Short Bio</h3>
          <p className="text-gray-700 leading-relaxed">{shortBio}</p>
        </section>
      )}

      {/* Specialized Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[ 
          { title: "Specialized Services", icon: <Star />, items: specializedServices, color: "bg-teal-100 text-teal-800" },
          { title: "Key Skills", icon: <Award />, items: keySkills, color: "bg-blue-100 text-blue-800" },
          { title: "Language Proficiency", icon: <Languages />, items: languageProficiency, color: "bg-green-100 text-green-800" },
        ].map(({ title, icon, items, color }, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              {icon}
              {title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(items || []).map((item, idx) => (
                <span key={idx} className={`px-3 py-1 ${color} rounded-full text-sm font-medium`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Availability Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Availability
          </h3>
          <p className="text-gray-600 text-sm md:text-base">
            <strong>Working Hours:</strong> {preferredWorkingHours || "09:30 - 05:00"}
          </p>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            <strong>Days Per Week:</strong> {daysPerWeek ? daysPerWeek.join(", ") : "Not specified"}
          </p>
        </div>
      </section>

      {/* Education Section */}
      {HeighestQualification && (
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Education
          </h3>
          <div className="border-l-4 border-teal-500 pl-5">
            <h4 className="font-semibold text-gray-800">{HeighestQualification.toUpperCase()}</h4>
            <p className="text-gray-600">{university}</p>
            <p className="text-sm text-gray-500">{fieldOfStudy} • {graduationYear}</p>
          </div>
        </section>
      )}

      {/* Certificates Section */}
      {certificates?.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            Certificates
          </h3>
          <div className="space-y-3">
            {certificates.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
        </section>
      )}
    </div>
  );
}

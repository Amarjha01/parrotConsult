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
  Shield,
  Users,
  Globe,
  CheckCircle,
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
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  if (!consultant) 
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-2xl">
                <img
                  src={profileImage || "https://i.postimg.cc/bryMmCQB/profile-image.jpg"}
                  alt={fullName}
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 rounded-full p-3 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <h1 className="text-4xl lg:text-5xl font-bold capitalize">{fullName}</h1>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              
              <p className="text-2xl text-blue-300 mb-4 capitalize">{primaryCategory}</p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-slate-300 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">4.8 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>{experience} Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>100+ Clients</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleBookNow}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Book Consultation
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            {shortBio && (
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  About
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">{shortBio}</p>
              </motion.div>
            )}

            {/* Skills & Services */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                Expertise
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Specialized Services", items: specializedServices, color: "bg-blue-50 text-blue-700 border-blue-200" },
                  { title: "Key Skills", items: keySkills, color: "bg-purple-50 text-purple-700 border-purple-200" },
                ].map(({ title, items, color }) => (
                  <div key={title}>
                    <h3 className="font-semibold text-slate-700 mb-3">{title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {(items || []).map((item, idx) => (
                        <span key={idx} className={`px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education & Certifications */}
            {HeighestQualification && (
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  Education & Credentials
                </h2>
                
                <div className="border-l-4 border-blue-500 pl-6 mb-6">
                  <h3 className="text-xl font-semibold text-slate-800">{HeighestQualification.toUpperCase()}</h3>
                  <p className="text-slate-600 font-medium">{university}</p>
                  <p className="text-slate-500">{fieldOfStudy} • {graduationYear}</p>
                </div>

                {certificates?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-3">Certifications</h3>
                    <div className="space-y-3">
                      {certificates.map((cert, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <span className="font-medium text-slate-800">{cert.name}</span>
                          {cert.fileUrl && (
                            <a
                              href={cert.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
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
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Contact Info */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">*******{phoneNumber?.toString().slice(-3)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">{address}</span>
                </div>
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">Availability</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-700">Working Hours</p>
                    <p className="text-slate-600">{preferredWorkingHours || "09:30 - 05:00"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-700">Available Days</p>
                    <p className="text-slate-600">{daysPerWeek ? daysPerWeek.join(", ") : "Monday - Friday"}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Languages */}
            {languageProficiency && (
              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Languages className="w-5 h-5 text-slate-600" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languageProficiency.map((lang, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pricing */}
            <motion.div 
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">Pricing</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">FREE</div>
                <p className="text-slate-600 line-through mb-4">₹{hourlyRate}/hour</p>
                <p className="text-sm text-slate-500">Limited time offer for new clients</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <motion.div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md border-2 border-slate-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-b border-slate-200 p-6 flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Book Consultation</h2>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">How it works</h3>
                <ol className="list-decimal list-inside space-y-3 text-slate-600">
                  <li><strong>Choose consultant:</strong> You've selected the perfect expert</li>
                  <li><strong>Pick date & time:</strong> Select a convenient slot</li>
                  <li><strong>Connect:</strong> Meet and get expert guidance</li>
                </ol>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setGetStarted(true);
                    setIsBookingOpen(false);
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <BookingPage isOpen={getStarted} onClose={() => setGetStarted(false)} consultant={consultant} />
    </div>
  );
}

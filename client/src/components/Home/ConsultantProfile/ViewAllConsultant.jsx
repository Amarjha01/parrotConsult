import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, Star, User, Calendar } from "lucide-react";
import { globalconsultantdetails } from "../../../apis/globalApi";
import BookingPage from "../../booking/BookingPage";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { Languages, MapPin, Clock, IndianRupee, ShieldCheck, Zap } from 'lucide-react';
const availabilities = ["All Availability", "Available", "Busy"];
const priceRanges = ["All Prices", "Budget", "Standard", "Premium"];

const useAnimation = (isVisible) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? "translateY(0px)" : "translateY(20px)",
  transition: "all 0.3s ease-in-out",
});

const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <button
          type="button"
          className="w-full bg-[#fefaee] border border-gray-300 rounded-md px-3 py-2 text-left text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#28544c] focus:border-[#28544c] transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">{value}</span>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-[#fefaee]  border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-[#fdf1df] focus:outline-none focus:bg-[#fdf1df] transition"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ConsultantCard = ({ consultant, onBookNow }) => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverStyle = {
    transform: isHovered ? "translateY(-6px)" : "translateY(0px)",
    boxShadow: isHovered
      ? "0 12px 24px rgba(0, 0, 0, 0.1)"
      : "0 2px 6px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <Link to={`/consultantprofile/${consultant._id}/${consultant.fullName}`}
      className="bg-[#fdf1df] h-61 rounded-2xl border-2 border-[#27514b] overflow-hidden relative max-w-3xl mx-auto"
      style={hoverStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* FREE Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center gap-1 bg-[#27514b] text-[#fdf1df] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          <Zap size={10} className="text-yellow-300" />
          FREE
        </span>
      </div>

      <div className="flex">
        {/* Left Side - Dark Green Section */}
        <div className="w-2/5 bg-gradient-to-br from-[#27514b] via-[#2a5a4f] to-[#1e3e35] flex flex-col justify-center items-center h-60 relative">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full border-4 border-[#fdf1df] bg-white shadow-lg overflow-hidden mb-4">
            {consultant.profileImage || consultant.profilePicture ? (
              <img
                src={consultant.profileImage || consultant.profilePicture}
                alt={consultant.fullName}
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = "https://i.postimg.cc/bryMmCQB/profile-image.jpg"}
              />
            ) : (
              <User className="w-10 h-10 text-gray-400 m-5" />
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 text-yellow-400 mb-2">
            <Star size={16} fill="currentColor" />
            <span className="text-lg font-bold text-[#fdf1df]">
              {(consultant.rating || 4.8).toFixed(1)}
            </span>
          </div>
          
          {/* Experience */}
          <div className="text-center">
            <div className="text-[#fdf1df] text-sm font-medium">
              {consultant.consultantRequest?.consultantProfile?.yearsOfExperience || consultant.experience || 0} Years Experience
            </div>
          </div>
        </div>

        {/* Right Side - Light Section */}
        <div className="w-72 h-60 p-1 flex flex-col justify-between">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-0.5 mb-2">
              <h3 className="text-xl font-bold text-[#27514b] capitalize">
                {consultant.fullName}
              </h3>
              {/* Verified Badge */}
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            
            {/* Category Badge */}
            <div className="inline-flex items-center gap-1 bg-[#27514b] text-[#fdf1df] px-3 py-1 rounded-lg text-sm font-medium mb-2">
              Category: {consultant.consultantRequest?.consultantProfile?.category || consultant.primaryCategory || "Strategy"}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-0.5 text-sm mb-2">
            <div className="flex items-center gap-2 text-[#27514b]">
              <Languages size={14} />
              <span className="font-medium">Languages:</span>
              <span>
                {consultant.consultantRequest?.consultantProfile?.languages?.slice(0, 2).join(", ") || 
                 consultant.languageProficiency?.slice(0, 2).join(", ") || 
                 "English"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[#27514b]">
              <MapPin size={14} />
              <span className="font-medium">Location:</span>
              <span>{consultant.location?.split(",")[0] || consultant.address?.split(",") || "Remote"}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#27514b]">
              <Clock size={14} />
              <span className="font-medium">Available:</span>
              <span>
                {consultant.consultantRequest?.consultantProfile?.daysPerWeek || 
                 consultant.availabilityPerWeek || "5"} days/week
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[#27514b]">
              <IndianRupee size={14} />
              <span className="font-medium">Rate:</span>
              <span className="line-through text-gray-500">
                ₹{consultant.consultantRequest?.consultantProfile?.sessionFee || consultant.hourlyRate || 0}/hr
              </span>
              <span className="text-green-600 font-bold ml-2">FREE</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              to={`/consultantprofile/${consultant._id}/${consultant.fullName}`}
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="w-full px-4 py-1 rounded-lg border-2 border-[#27514b] text-[#27514b] text-xs font-semibold hover:bg-[#27514b] hover:text-[#fdf1df] transition-all duration-200">
                View Profile
              </button>
            </Link>
            
            <button
              className="flex-1 px-4 py-1 text-xs rounded-lg font-semibold bg-[#27514b] text-[#fdf1df] hover:bg-[#1e3e35] transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBookNow(consultant);
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
      
    </Link>
  );
};

export default function ViewAllConsultant() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAvailability, setSelectedAvailability] = useState("All Availability");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [getStarted , setGetStarted] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  const dynamicCategories = useMemo(() => {
    const unique = consultants
      .map(c => c.consultantRequest?.consultantProfile?.category?.toLowerCase().trim())
      .filter(Boolean);
    return ["All Categories", ...Array.from(new Set(unique))];
  }, [consultants]);

  useEffect(() => {
    const fetchConsultants = async () => {
      setLoading(true);
      try {
        const result = await globalconsultantdetails();
        const transformed = result
          .filter(c => c.role === "consultant")
          .map(c => ({
            ...c,
            rating: (c.consultantRequest.consultantProfile.yearsOfExperience / 5) + 3,
            availability: c.consultantRequest.consultantProfile.daysPerWeek > 0 ? "Available" : "Busy",
            price:
              c.consultantRequest.consultantProfile.sessionFee <= 500
                ? "Budget"
                : c.consultantRequest.consultantProfile.sessionFee <= 1000
                ? "Standard"
                : "Premium",
          }));
        setConsultants(transformed);
      } catch (err) {
        setError("Failed to fetch consultants.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  const filteredConsultants = useMemo(() => {
    return consultants.filter(consultant => {
      const matchesSearch =
        consultant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.consultantRequest.consultantProfile.shortBio?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        consultant.consultantRequest?.consultantProfile?.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim();

      const matchesAvailability =
        selectedAvailability === "All Availability" ||
        consultant.availability === selectedAvailability;

      const matchesPrice =
        selectedPrice === "All Prices" || consultant.price === selectedPrice;

      return matchesSearch && matchesCategory && matchesAvailability && matchesPrice;
    });
  }, [searchTerm, selectedCategory, selectedAvailability, selectedPrice, consultants]);

  const handleBookNow = (consultant) => {
    setSelectedConsultant(consultant);
    setIsBookingOpen(true);
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="lg:h-auto h-[89vh]  py-6 mb-3.5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search</h1>
        <div className="relative max-w-lg mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search consultants..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-2 pb-12">
          <aside className="lg:w-64 w-full bg-[#fefaee] shadow rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
            <div className="space-y-6">
              <FilterDropdown label="Category" options={dynamicCategories} value={selectedCategory} onChange={setSelectedCategory} />
              <FilterDropdown label="Availability" options={availabilities} value={selectedAvailability} onChange={setSelectedAvailability} />
              <FilterDropdown label="Price" options={priceRanges} value={selectedPrice} onChange={setSelectedPrice} />
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <p className="text-center text-gray-500 py-12">Loading consultants...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-12">{error}</p>
            ) : filteredConsultants.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No consultants found matching your criteria.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-2">
                {filteredConsultants.map((consultant, index) => (
                  <ConsultantCard key={consultant._id} consultant={consultant} onBookNow={handleBookNow} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {isBookingOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="border border-teal-700 rounded-2xl shadow-xl w-full max-w-md md:max-w-lg bg-white/70 backdrop-blur-xl">
            <div className="border-b border-gray-200 p-6 flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-teal-700" />
              <h2 className="text-xl font-bold text-teal-900">Book a consultation</h2>
            </div>

            <div className="p-6">
              <motion.section
                className="bg-teal-50 rounded-2xl p-4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-lg font-semibold text-teal-900 mb-4">How it works</h3>
                <ol className="list-decimal list-inside space-y-4 text-gray-700 text-sm">
                  <li>
                    <strong>Choose your consult:</strong> Select the consultant who fits best your needs.
                  </li>
                  <li>
                    <strong>Select date & time:</strong> Pick an available slot that works for you.
                  </li>
                  <li>
                    <strong>Let's connect:</strong> Meet with your consultant and get the guidance you seek.
                  </li>
                </ol>
              </motion.section>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setGetStarted(true);
                    setIsBookingOpen(false);
                  }}
                  className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transition-transform hover:scale-105"
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
        consultant={selectedConsultant}
      />
    </div>
  );
}

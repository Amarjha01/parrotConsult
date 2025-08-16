import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, Star, User, Calendar } from "lucide-react";
import { globalconsultantdetails } from "../../../apis/globalApi";
import BookingPage from "../../booking/BookingPage";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

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
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">{value}</span>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-teal-50 focus:outline-none focus:bg-teal-50 transition"
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
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden relative cursor-pointer max-w-lg mx-auto"
      style={hoverStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/consultantprofile/${consultant._id}/${consultant.fullName}`} 
        className="flex p-6 space-x-6 items-center no-underline"
      >
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border border-gray-300 shadow-sm">
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
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 capitalize truncate">{consultant.fullName}</h3>
          <p className="text-sm text-gray-600 mb-1 capitalize truncate">
            {consultant.consultantRequest?.consultantProfile?.category || consultant.primaryCategory || "General Consultant"}
          </p>
          {consultant.consultantRequest?.consultantProfile?.shortBio && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
              {consultant.consultantRequest.consultantProfile.shortBio}
            </p>
          )}

          <div className="flex text-xs text-gray-500 space-x-4">
            <div className="flex items-center space-x-1 truncate">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{(consultant.rating || 4.8).toFixed(1)}</span>
            </div>
            <div className="truncate">{consultant.availability || "Unknown Availability"}</div>
            <div className="truncate">
              ₹{consultant.consultantRequest?.consultantProfile?.sessionFee || 0}/hr
            </div>
          </div>

          <div className="text-xs text-gray-400 truncate mt-1">
            {consultant.location || consultant.address || "Remote"}
          </div>
        </div>
      </Link>

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex space-x-4">
        <Link 
          to={`/consultantprofile/${consultant._id}/${consultant.fullName}`} 
          className="flex-1"
          onClick={e => e.stopPropagation()}
        >
          <button 
            className="w-full px-4 py-2 rounded-md border border-teal-500 text-teal-600 font-medium hover:bg-teal-50 transition"
          >
            View Profile
          </button>
        </Link>

        <button 
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onBookNow(consultant);
          }}
          className="flex-1 px-4 py-2 rounded-md bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
        >
          Book Now
        </button>
      </div>
    </div>
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
    <div className="lg:min-h-screen h-[89vh]  p-6">
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

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-64 w-full bg-white rounded-lg p-6 border border-gray-200">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

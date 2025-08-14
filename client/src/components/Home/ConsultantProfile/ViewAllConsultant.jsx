import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, Star, User, Calendar } from "lucide-react";
import { globalconsultantdetails } from "../../../apis/globalApi";
import BookingPage from "../../booking/BookingPage";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

const useAnimation = (isVisible) => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? "translateY(0px)" : "translateY(20px)",
  transition: "all 0.3s ease-in-out",
});


const availabilities = ["All Availability", "Available", "Busy"];
const priceRanges = ["All Prices", "Budget", "Standard", "Premium"];

const ConsultantCard = ({ consultant, index, onBookNow }) => {
  console.log(consultant);
  
  const [isHovered, setIsHovered] = useState(false);
  const animationStyle = useAnimation(true);

  const hoverStyle = {
    transform: isHovered ? "translateY(-8px)" : "translateY(0px)",
    boxShadow: isHovered
      ? "0 20px 40px rgba(34, 197, 94, 0.2), 0 8px 25px rgba(0,0,0,0.15)"
      : "0 4px 15px rgba(0,0,0,0.08)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <div
      className="bg-white rounded-4xl p-0 border-2 border-orange-200 overflow-hidden relative group"
      style={{ ...animationStyle, ...hoverStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Parrot decoration */}
      <div className="absolute top-3 right-3 w-12 h-12 opacity-20 group-hover:opacity-90 transition-opacity duration-300">
        <img 
          src="/parrot.png" 
          alt="Parrot decoration" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Entire clickable area (excluding Book Now button) */}
      <Link
        to={`/consultantprofile/${consultant._id}/${consultant.fullName}`}
        className="block p-6 relative z-10"
      >
        <div className="flex items-start space-x-5">
          <div className="relative">
            <div className="w-18 h-18 bg-gradient-to-br from-green-100 to-teal-100 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-green-200 group-hover:ring-green-300 transition-all duration-300">
              {consultant.profileImage ? (
                <img
                  src={consultant.profileImage}
                  alt={consultant.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://i.postimg.cc/bryMmCQB/profile-image.jpg";
                  }}
                />
              ) : (
                <User className="w-9 h-9 text-green-600 mx-auto mt-4" />
              )}
            </div>
            {/* Online status indicator */}
            {/* <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm">
              <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
            </div> */}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 capitalize group-hover:text-green-800 transition-colors duration-200">
                {consultant.fullName}
              </h3>
              {/* <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">Available</span>
              </div> */}
            </div>
            
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              <p className="text-sm text-teal-700 font-semibold capitalize">
                {consultant.consultantRequest.consultantProfile.category}
              </p>
            </div>
            
            <div className="space-y-1 mb-3">
              <p className="text-xs text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                {consultant.email}
              </p>
              <p className="text-xs text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                *******{consultant.phoneNumber?.toString().slice(-3)}
              </p>
              <p className="text-xs text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                {consultant.address}
              </p>
            </div>

            {/* Enhanced Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                <div className="flex items-center mr-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(consultant.rating)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-yellow-700">
                  {consultant.rating?.toFixed(1)}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                Perry Verified Consultant
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Enhanced Book Now Button */}
      <div className="px-6 pb-6 relative z-10">
        <button
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-3xl transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
          onClick={(e) => {
            e.stopPropagation(); // prevent Link click
            onBookNow(consultant);
          }}
        >
          <span>Book Now</span>
          <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-teal-500 to-green-500"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-green-100/30 to-transparent rounded-tl-full opacity-50"></div>
    </div>
  );
};

const FilterDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">{value}</span>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {options.map((option) => (
              <button
                key={option}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
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

export default function ViewAllConsultant() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAvailability, setSelectedAvailability] =
    useState("All Availability");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [getStarted , setGetStarted] = useState(false)
  const [selectedConsultant, setSelectedConsultant] = useState(null);
console.log('transformed 86u57' , consultants);
console.log('fghjhgdxfcgvhb vcxdfgvhb' , selectedConsultant);

  const dynamicCategories = useMemo(() => {
    const unique = consultants
      .map((c) => c.consultantRequest?.consultantProfile?.category?.toLowerCase().trim())
      .filter(Boolean);
    return ["All Categories", ...Array.from(new Set(unique))];
  }, [consultants]);

  
  useEffect(() => {
    const fetchConsultants = async () => {
      setLoading(true);
      try {
        
        const result = await globalconsultantdetails();
        console.log('result' , result);
        
        const transformed = result
          .filter((c) => {
           return c.role === "consultant";
            // console.log('c.role' , c.role , c.consultantRequest);
            
          } )
          .map((c) => ({
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
          console.log('transformed 3435' , transformed);
      } catch (err) {
        console.log(err);
        
        setError("Failed to fetch consultants." , err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchConsultants();
  }, []);

  const filteredConsultants = useMemo(() => {
    return consultants.filter((consultant) => {
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
  
      return (
        matchesSearch && matchesCategory && matchesAvailability && matchesPrice
      );
    });
  }, [
    searchTerm,
    selectedCategory,
    selectedAvailability,
    selectedPrice,
    consultants,
  ]);
  
  const handleBookNow = (consultant) => {
    console.log('consultant booking' , consultant);
    
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Search
          </h1>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search consultants..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 w-full">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Filters
              </h2>
              <div className="space-y-6">
              <FilterDropdown
  label="Category"
  options={dynamicCategories}
  value={selectedCategory}
  onChange={setSelectedCategory}
/>

                <FilterDropdown
                  label="Availability"
                  options={availabilities}
                  value={selectedAvailability}
                  onChange={setSelectedAvailability}
                />
                <FilterDropdown
                  label="Price"
                  options={priceRanges}
                  value={selectedPrice}
                  onChange={setSelectedPrice}
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Loading consultants...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : filteredConsultants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No consultants found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredConsultants.map((consultant, index) => (
                  <ConsultantCard
                    key={consultant._id}
                    consultant={consultant}
                    index={index}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isBookingOpen && (
  <div className="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-sm p-4">
    <div className=" border border-green-900 rounded-2xl shadow-xl w-full max-w-md md:max-w-lg bg-white/50  backdrop-blur-xl">
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
            {/* Step 1 */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-7 h-7 bg-[#3b8c60] text-white rounded-full flex items-center justify-center font-semibold text-xs">
                1
              </div>
              <div>
                <h3 className="font-semibold text-[#103e39]">Choose your consult</h3>
                <p className="text-gray-600">Select the consultant who fits best your needs</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-7 h-7 bg-[#3b8c60] text-white rounded-full flex items-center justify-center font-semibold text-xs">
                2
              </div>
              <div>
                <h3 className="font-semibold text-[#103e39]">Select date & time</h3>
                <p className="text-gray-600">Pick an available slot that works for you</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-7 h-7 bg-[#3b8c60] text-white rounded-full flex items-center justify-center font-semibold text-xs">
                3
              </div>
              <div>
                <h3 className="font-semibold text-[#103e39]">Let's connect</h3>
                <p className="text-gray-600">Meet with your consultant and get the guidance you seek</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Get Started Button */}
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
  consultant={selectedConsultant}
/>
    </div>
  );
}

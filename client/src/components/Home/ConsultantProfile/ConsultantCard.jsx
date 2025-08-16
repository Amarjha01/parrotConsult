import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  IndianRupee,
  Languages,
  Star,
  Badge,
  Zap,
  ChevronRight,
  ChevronLeft,
  Calendar,
  ArrowRight,
  Eye,
  ShieldCheck,
  Verified
} from "lucide-react";
import { Link } from "react-router-dom";
import { globalconsultantdetails } from "../../../apis/globalApi";
import Slider from "react-slick";
import BookingPage from "../../booking/BookingPage";
import { motion, AnimatePresence } from 'framer-motion';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ✅ Custom Arrows (define these above sliderSettings)
const NextArrow = ({ onClick }) => (
  <div
    className="text-2xl absolute z-10 right-0 top-[35%] bg-[#ce663c] text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer"
    onClick={onClick}
  >
    <ChevronRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className=" text-2xl absolute z-10 left-0 top-[35%] bg-[#ce663c] text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer"
    onClick={onClick}
  >
    <ChevronLeft />
  </div>
);

// ✅ Now sliderSettings will work
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  autoplay: true,
  centerPadding: "20px", // Add this
  responsive: [
    {
      breakpoint: 1024,
      settings: { 
        slidesToShow: 1,
        centerPadding: "15px" 
      },
    },
    {
      breakpoint: 570,
      settings: { 
        slidesToShow: 1,
        centerPadding: "10px"
      },
    },
  ],
};


const InfoCard = ({ icon, title, value }) => (
  <div className="flex items-start gap-2 bg-white rounded p-2">
    <div className="text-[#348559]">{icon}</div>
    <div className="text-left">
      <div className="font-medium text-gray-800 text-[10px]">{title}</div>
      <div className="text-gray-600 text-xs truncate">{value}</div>
    </div>
  </div>
);

export default function ConsultantCard() {


   const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [getStarted , setGetStarted] = useState(false)
  
    const handleBookNow = (consultant) => {
      console.log('booking called');
      
      const user = JSON.parse(localStorage.getItem("user"));
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
  
     const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consultants data on component mount
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const response = await globalconsultantdetails();    
        console.log('response' , response);
            
        setConsultants(response || []);
      } catch (err) {
        setError(err.message || "Failed to fetch consultants");
        console.error("Error fetching consultants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  // Handle view profile click
  const handleViewProfile = (consultant) => {
    setSelectedConsultant(consultant);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedConsultant(null);
  };


 

 return (
  <div className="my-7 ">
        
     <div className=" flex justify-between px-2">
       <h2 className="text-xl font-bold md:text-3xl mb-12 text-[#023c2d] ">
          Meet Our Experts
        </h2>
        <Link to={'/ViewAllConsultants'}
  className="group flex justify-center items-center h-12 cursor-pointer px-3 py-1.5 md:px-6 md:py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-2 "
  style={{
    backgroundColor: '#2c7951',
    borderColor: '#1c7259',
  }}
>
  <div className="flex items-center gap-2 relative z-10">
    <Eye className="w-4 h-4 text-white"  />
    <span
      className="font-bold tracking-wide text-sm uppercase text-white"
      
    >
      VIEW ALL
    </span>
    <ArrowRight
      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 text-white"
      
    />
  </div>

  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
</Link>
     </div>

        {consultants.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No consultants available at the moment.
          </div>
        ) : (
// Update your slider container div
<div className="   w-full "> {/* Added px-8 for horizontal padding */}
  
  <Slider {...sliderSettings}>
    {consultants.map((consultant, index) => (
      <div key={index} className="py-5 px-1"> {/* Added padding around each slide */}
        <Card
          consultant={consultant}
          onBookNow={handleBookNow}
        />
      </div>
    ))}
  </Slider>
  
</div>
)}


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
 )
  


}



const Card = ({consultant, onBookNow}) => {
  const {
    fullName,
    primaryCategory = consultant?.consultantRequest?.consultantProfile?.category,
    languageProficiency,
    address = consultant?.location,
    profilePicture = consultant?.profileImage,
    hourlyRate = consultant.consultantRequest.consultantProfile.sessionFee,
    experience = consultant?.consultantRequest?.consultantProfile?.yearsOfExperience,
    availabilityPerWeek = consultant?.consultantRequest?.consultantProfile?.daysPerWeek,
    _id,
  } = consultant;

  return (
    <div className=" w-96 h-60 rounded-2xl shadow border-2 border-[#27514b]  transition-all overflow-hidden duration-300 hover:shadow-lg hover:scale-[1.02] relative group">
      <Link to={`/consultantprofile/${_id}/${fullName}`}>
      {/* FREE Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-[#348559] via-[#09533d] to-[#113a39] text-white px-2 py-1 rounded-full font-bold shadow-lg">
          <Zap size={8} className="text-yellow-300" />
          FREE
        </span>
      </div>

      <div className="flex h-full">
        {/* Left Side - Brand/Header */}
        <div className="w-2/5 bg-gradient-to-br from-[#27514b] via-[#2a5a4f] to-[#1e3e35] flex flex-col justify-center items-center p-4 relative">
          {/* Profile Image */}
          <div className="w-16 h-16 rounded-full border-3 border-[#fdf1df] bg-white shadow-lg overflow-hidden mb-3">
            <img
              src={profilePicture || "https://i.postimg.cc/bryMmCQB/profile-image.jpg"}
              alt={`${fullName}'s profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://i.postimg.cc/bryMmCQB/profile-image.jpg";
              }}
            />
          </div>
          
          {/* Rating & Experience */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-bold text-[#fdf1df]">4.8</span>
            </div>
            <div className="text-[#fdf1df] text-xs font-medium">
              {experience} Years Experience
            </div>
          </div>
        </div>

        {/* Right Side - Information */}
        <div className="w-3/5 p-4 flex flex-col justify-between">
          {/* Header Info */}
          <div>
           <div className=" flex  items-center gap-1  mb-1">
             <h3 className="text-lg font-bold text-[#27514b]  leading-tight">
              {fullName}
            </h3>
            {Verified && (
                <ShieldCheck className="w-5 h-5 text-emerald-600" title="Verified Consultant" />
              )}
           </div>
            <div className="inline-flex items-center gap-1 bg-[#27514b] bg-opacity-10 px-2 py-1 rounded-lg text-xs font-medium text-white mb-3 capitalize">
              <Badge size={10} />
              <span className="">Category:</span>
              {primaryCategory}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#27514b]">
              <Languages size={12} />
              <span className="font-medium">Languages:</span>
              <span>{languageProficiency?.slice(0,2).join(", ") || "English"}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#27514b]">
              <MapPin size={12} />
              <span className="font-medium">Location:</span>
              <span>{address?.split(",")[0] || "Remote"}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#27514b]">
              <Clock size={12} />
              <span className="font-medium">Available:</span>
              <span>{availabilityPerWeek || "10"} days/week</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#27514b]">
              <IndianRupee size={12} />
              <span className="font-medium">Rate:</span>
              <span className="line-through text-gray-500">₹{hourlyRate}/hr</span>
              <span className="text-green-600 font-bold ml-1">FREE</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <Link
              to={`/consultantprofile/${_id}/${fullName}`}
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="w-full px-3 py-2 rounded-lg border border-[#27514b] text-[#27514b] font-semibold text-xs hover:bg-[#27514b] hover:text-[#fdf1df] transition-all duration-200 cursor-pointer">
                View Profile
              </button>
            </Link>
            <button
              className="flex-1 px-3 py-2 rounded-lg font-semibold text-xs bg-gradient-to-r from-[#27514b] via-[#2a5a4f] to-[#1e3e35] text-[#fdf1df] hover:shadow-lg transition-all duration-200 cursor-pointer"
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
    </div>
  );
};



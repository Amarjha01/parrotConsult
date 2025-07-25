import React, { useState } from "react";
import ConsultantCard from "./ConsultantCard";
import ConsultantBookingForm from "../../forms/BookingForm";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, MessageCircle } from 'lucide-react';
import BookingPage from "../booking/BookingPage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// ✅ Custom Arrows (define these above sliderSettings)
const NextArrow = ({ onClick }) => (
  <div
    className="text-2xl absolute z-10 right-0 top-[35%] bg-red-500 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer"
    onClick={onClick}
  >
    <ChevronRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className=" text-2xl absolute z-10 left-0 top-[35%] bg-red-500 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer"
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
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  autoplay: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 1 },
    },
    {
      breakpoint: 640,
      settings: { slidesToShow: 1 },
    },
  ],
};




export default function MeetExperts({ consultants, onViewProfile }) {

  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
const [getStarted , setGetStarted] = useState(false)

  const handleBookNow = (consultant) => {
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
  
  return (
    <section className=" bg-white">
    
      <div className="px-4 overflow-hidden relative">
        <Link to={'/ViewAllConsultants'}>
      <div
  className="absolute right-5 group cursor-pointer px-3 py-1.5 md:px-6 md:py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-2 overflow-hidden"
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
</div>

        </Link>
    
        <h2 className="text-xl font-bold md:text-3xl mb-12">
          Meet Our Experts
        </h2>

        {consultants.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No consultants available at the moment.
          </div>
        ) : (
 <div className="relative overflow-hidden w-full ">
  
  <Slider {...sliderSettings}>
    {consultants.map((consultant, index) => (
      <div key={index} className="">
        <ConsultantCard
          consultant={consultant}
          onViewProfile={onViewProfile}
          onBookNow={handleBookNow}
        />
      </div>
    ))}
  </Slider>
</div>


        )}
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
      {/* <ConsultantBookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedConsultant={selectedConsultant}
      /> */}
    </section>
  );
}

const marqueeStyle = `
  @keyframes scroll-left {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }

  .marquee {
    animation: scroll-left 30s linear infinite;
    display: flex;
    width: max-content;
  }

  .marquee:hover {
    animation-play-state: paused;
  }
`;

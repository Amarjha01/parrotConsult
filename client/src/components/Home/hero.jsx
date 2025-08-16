import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleAsk = () => {
    if (searchQuery.trim()) {
      navigate(`/chatbot?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAsk();
  };

  return (
    <section
      className=" px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16 bg-no-repeat bg-center bg-cover min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-[85vh] xl:min-h-[90vh] overflow-hidden"
      style={{
        backgroundImage: "url('/bg.png')",
      }}
    >
      <div className="max-w-screen-2xl mx-auto h-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 h-full">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
            {/* Main Heading - Highly responsive text sizing */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-teal-900 mb-4 sm:mb-5 md:mb-6 leading-tight max-w-2xl mx-auto lg:mx-0">
              Fly Higher with the Right Advice
            </h1>

            {/* Subtitle - Responsive text and spacing */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-7 md:mb-8 max-w-md sm:max-w-lg mx-auto lg:mx-0 px-2 sm:px-0">
              Get expert guidance across a range of fields.
            </p>

            {/* Search Input - Fully responsive */}
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0">
              <input
                type="text"
                placeholder="What can we assist you with?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress} // 🆕 detect Enter
                className="w-full  px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base rounded-full border border-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              <button
                onClick={handleAsk} // 🆕 Ask button handler
                className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-green-800 text-white p-1.5 sm:p-2 rounded-full hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Search size={16} className="sm:w-5 sm:h-5" />
              </button>
              {/* <button
        onClick={() => navigate("/consultant-quiz")}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg"
      >
        🤔 Not sure who to consult? Let us guide you!
      </button> */}
            </div>
          </div>

          {/* Right Image - Optimized for all screen sizes */}
          <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2">
            <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[450px] xl:max-w-[550px] 2xl:max-w-[650px] aspect-square relative">
              <img
                src="/parrot.png"
                alt="Parrot"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
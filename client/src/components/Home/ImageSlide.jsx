import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const slidesData = [
  {
    name: "Switzerland",
    des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    url: "https://i.ibb.co/qCkd9jS/img1.jpg",
  },
  {
    name: "Finland",
    des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    url: "https://i.ibb.co/jrRb11q/img2.jpg",
  },
  {
    name: "Iceland",
    des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    url: "https://i.ibb.co/NSwVv8D/img3.jpg",
  },
  {
    name: "Australia",
    des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    url: "https://i.ibb.co/Bq4Q0M8/img4.jpg",
  },
  {
    name: "Netherland",
    des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    url: "https://i.ibb.co/jTQfmTq/img5.jpg",
  },
  {
    name: "Ireland",
    des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    url: "https://i.ibb.co/RNkk6L0/img6.jpg",
  },
];

export default function ImageSlider() {
  const [slides, setSlides] = useState(slidesData);

  const handleNext = () => {
    setSlides((prev) => [...prev.slice(1), prev[0]]);
  };

  const handlePrev = () => {
    setSlides((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-gray-200 overflow-hidden">
      <div className="relative w-[1000px] h-[600px] bg-gray-100 shadow-2xl overflow-hidden">
        <div className="absolute w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute rounded-xl shadow-lg bg-center bg-cover transition-all duration-500`}
              style={{
                backgroundImage: `url(${slide.url})`,
                width: index === 0 || index === 1 ? "100%" : "200px",
                height: index === 0 || index === 1 ? "100%" : "300px",
                top: index === 0 || index === 1 ? "0" : "50%",
                left:
                  index === 0
                    ? "0"
                    : index === 1
                    ? "0"
                    : `calc(50% + ${(index - 2) * 220}px)`,
                transform: index === 0 || index === 1 ? "translate(0,0)" : "translate(0,-50%)",
                borderRadius: index === 0 || index === 1 ? "0px" : "20px",
                boxShadow: "0 30px 50px rgba(0,0,0,0.5)",
              }}
            >
              {(index === 0 || index === 1) && (
                <div className="absolute bottom-10 left-10 text-white max-w-lg">
                  <div className="text-4xl font-bold">{slide.name}</div>
                  <div className="mt-2 text-lg">{slide.des}</div>
                  <button className="mt-4 px-4 py-2 bg-white text-black rounded shadow hover:bg-gray-300 transition">
                    See More
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="absolute bottom-5 right-5 flex gap-2">
          <button
            onClick={handlePrev}
            className="p-3 bg-white rounded-full shadow hover:bg-gray-300 transition"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNext}
            className="p-3 bg-white rounded-full shadow hover:bg-gray-300 transition"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

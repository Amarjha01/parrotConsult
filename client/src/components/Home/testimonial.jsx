import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Star } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Sample testimonial data
const testimonials = [
  {
    quote:
      "Incredibly smooth process. Found an expert who gave us exactly what we needed to grow.",
    name: "Jyoti pathak",
    image: "https://cdn-icons-png.freepik.com/256/6997/6997662.png?semt=ais_hybrid",
    service: "IT Consulting",
  },
  {
    quote:
      "Their ecommerce consulting helped us triple our online revenue in just a few months.",
    name: "Suresh mittle",
    image: "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-1024.png",
    service: "Ecommerce Consulting",
  },
  {
    quote:
      "We needed legal guidance and found clear, actionable advice that protected our business.",
    name: "Ahmed Khan",
    image: "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-1024.png",
    service: "Legal Consulting",
  },
];

export default function Testimonials() {
  return (
    <section className=" ">
      <div className=" py-10 max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#27514b]">
          Early User Testimonials
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className=" px-10 py-10 flex flex-col items-center">
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-2xl md:text-3xl font-semibold text-gray-800 max-w-3xl mb-6">
                  “{testimonial.quote}”
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border border-gray-300"
                  />
                  <div className="text-left">
                    <p className="text-lg font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.service}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

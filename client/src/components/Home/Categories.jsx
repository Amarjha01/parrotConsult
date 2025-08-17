import React, { useState, useEffect } from 'react';
import { 
  Code, 
  ShoppingCart, 
  Scale,
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PopularCategoriesPage = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    {
      id: 1,
      icon: Code,
      title: "IT Consulting",
      description: "Get expert guidance on your technology needs",
      tutors: 2450,
      rating: 4.9,
      reviews: 1247,
      shadow: "shadow",
     },
    {
      id: 2,
      icon: ShoppingCart,
      title: "Ecommerce Consulting",
      description: "Spice up your business portfolio for sustainable growth",
      tutors: 1850,
      rating: 4.8,
      reviews: 923,
      shadow: "shadow",
 
    },
    {
      id: 3,
      icon: Scale,
      title: "Legal Consulting",
      description: "Navigate complex legal challenges with confidence",
      tutors: 980,
      rating: 4.9,
      reviews: 654,
     shadow: "shadow",

    }
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 sm:py-32">
        {/* Background decoration */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.1),transparent_50%)]"></div> */}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-[#023c2d]">
                Popular Categories
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect with expert consultants in the most sought-after fields
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredCategory === category.id;
            
            return (
             <Link to={'/ViewAllConsultants'} key={category.id}>
              <div
                className={`group relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Main Card */}
                <div className={`relative overflow-hidden rounded-3xl transition-all duration-500 cursor-pointer ${
                  isHovered 
                    ? `transform -translate-y-4 ${category.shadow} shadow-2xl` 
                    : 'shadow-xl hover:shadow-2xl'
                }`}>
                  
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 ${category.bgPattern}`}></div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Decorative Elements */}
                  {/* <div className="absolute -top-10 -right-10 w-32 h-32 bg-black rounded-full blur-xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/30 rounded-full blur-lg"></div> */}
                  
                  {/* Content */}
                  <div className="relative p-8 sm:p-10 bg-[#fdf1df] backdrop-blur-sm">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-500 bg-[#fefaee] shadow-lg ${
                      isHovered ? 'scale-110 rotate-3' : ''
                    }`}>
                      <Icon className="w-8 h-8 text-green-900 drop-shadow-sm" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-800 transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold text-gray-900">{category.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({category.reviews} reviews)</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{category.tutors.toLocaleString()}+ tutors</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r ${category.gradient} text-green-900 shadow-lg md:shadow-none  hover:shadow-lg transform hover:scale-105 group-hover:shadow-xl`}>
                      <span className="flex items-center justify-center gap-2">
                        Explore Consultants
                        <ArrowRight className={`w-4 h-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
             </Link>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 p-12 shadow-2xl">
           
            
          <div className="relative">
  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
    Ready to Grow with Expert Consulting?
  </h2>
  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
    Join thousands of businesses already thriving with guidance from top consultants in IT, E-commerce, and Legal services.
  </p>

  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
   <Link to={'/ViewAllConsultants'}>
    <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
      Explore Consultants
    </button>
   </Link>
   <Link to={'/newsignin'}>
    <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-emerald-600 transition-all duration-300">
      Offer Consulting Services
    </button>
   </Link>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularCategoriesPage;
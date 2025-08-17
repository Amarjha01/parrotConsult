import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  Award, 
  Globe,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Heart,
  Lightbulb,
  Shield,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { TbTargetArrow } from "react-icons/tb";
import { FaRegHandshake } from "react-icons/fa6";
import { HiLightBulb } from "react-icons/hi";
import {  Zap, DollarSign } from 'lucide-react';
import { sendContactUsMail } from '../../apis/globalApi';
import { showSuccessToast } from '../../util/Notification';
const AboutUsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
const [hoveredCard, setHoveredCard] = useState(null);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const response = await sendContactUsMail(formData);
    if(response.status === 200){
      showSuccessToast('Form submited successfully')
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const stats = [
    { number: '50K+', label: 'User Served', icon: Users },
    { number: '5K+', label: 'Consultent', icon: Award },
    { number: '1', label: 'Countries', icon: Globe },
    { number: '4.9★', label: 'Average Rating', icon: Star }
  ];

  const values = [
    {
      icon: TbTargetArrow,
      title: 'Excellence',
      description: 'We strive for the higst standards in everything we do.',
     
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We conduct our business with honesty and transparency',
      
    },
    {
      icon: HiLightBulb,
      title: 'Innovation',
      description: 'We embrace new ideas and continuously seek to Improve',
     
    }
  ];

  const teamMembers = [
    {
      name: 'Rajat Verma',
      role: 'Founder',
      image: '/team/rajat.png',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      name: 'tabrez mirxa',
      role: 'Co-founder',
      image: '/team/tabrez.webp',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      name: 'nandani kalra',
      role: 'Co-founder',
      image: '/team/nandani.jpg',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

    const visionPoints = [
    "Founder-driven content",
    "Viral storytelling", 
    "Offline activations",
    "And Parry's unforgettable personality"
  ];

   const differentiators = [
    {
      icon: Shield,
      title: "Verified Experts",
      description: "Every consultant on our platform is thoroughly vetted with verified credentials and proven track records.",
      features: ["Background Verified", "Industry Certified", "Client Reviewed"],
      gradient: "from-slate-900 via-emerald-900 to-teal-900",
      accentColor: "emerald"
    },
    {
      icon: Heart,
      title: "Built for Bharat",
      description: "Designed specifically for Indian businesses with local insights, cultural understanding, and regional expertise.",
      features: ["Local Context", "Regional Languages", "Cultural Sensitivity"],
      gradient: "from-slate-900 via-emerald-900 to-teal-900",
      accentColor: "emerald"
    },
    {
      icon: Zap,
      title: "Instant Connection",
      description: "Connect with the right expert in minutes, not days. Quick matching algorithm gets you started immediately.",
      features: ["60-Second Matching", "24/7 Availability", "Real-time Chat"],
      gradient: "from-slate-900 via-emerald-900 to-teal-900",
      accentColor: "emerald"
    },
    {
      icon: DollarSign,
      title: "Affordable & Transparent",
      description: "Clear, upfront pricing with no hidden fees. Quality consulting that doesn't break the bank.",
      features: ["No Hidden Costs", "Flexible Pricing", "Money-back Guarantee"],
     gradient: "from-slate-900 via-emerald-900 to-teal-900",
      accentColor: "emerald"
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-">
   
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 sm:py-32 flex flex-col gap-10 items-center md:flex-row md:justify-center md:items-center ">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.1),transparent_50%)]"></div> */}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* <div className="inline-flex items-center gap-3 bg-emerald-100 px-6 py-3 rounded-full mb-8">
              <Heart className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-700">Our Story</span>
              <Sparkles className="w-5 h-5 text-[#27514b]" />
            </div> */}
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-[#27514b] bg-clip-text text-transparent">
                About Us
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We are dedicated to providing expert consulting and strategic
              solutions to help your business thrive. Our mission is to emp-
              ower businesses with the knowledge and tools they
              need to achieve their goals.
            </p>
          </div>
        </div>
       
      </div>

      {/* vission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          <div className="inline-flex items-center gap-2 bg-emerald-100  px-6 py-3 rounded-full mb-8 shadow-lg border border-emerald-200">
            <Target className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 tracking-wide">Our Big Vision</span>
          </div>
                       
          <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
            A Smart Consulting 
            <span className="block text-transparent bg-clip-text bg-[#27514b]">
              Platform
            </span>
          </h2>
                       
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-8 mb-8 shadow-xl border border-yellow-100">
            <p className="text-xl text-gray-700 mb-6 leading-relaxed font-medium">
              To become India's most trusted, loved, and accessible consulting brand, by blending
            </p>
            
            <div className="space-y-4">
              {visionPoints.map((point, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-4 transition-all duration-700 delay-${(index + 1) * 200} ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 shadow-lg"></div>
                  <p className="text-lg text-gray-700 font-medium">{point}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-1 bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Building Excellence</span>
          </div>
        </div>
                   
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <div className="relative">
            
            <div className="absolute -inset-1 bg-gradient-to-r from-green-950 to-[#fef8e4]   rounded-3xl opacity-50"></div>
            
            <div className="relative bg-white rounded-3xl p-10 shadow-2xl border border-yellow-100">
              
              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={index} 
                      className={`text-center group hover:transform hover:scale-105 transition-all duration-300 delay-${index * 100}`}
                    >
                      <div className="relative mb-4">
                        
                        <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-center">
                  <div className="bg-emerald-50  px-6 py-2 rounded-full border border-emerald-200">
                    <span className="text-sm font-semibold text-emerald-700">Trusted by Industry Leaders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


     <div className=" py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unique Edge Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-6 py-3 rounded-full mb-8 shadow-lg border border-emerald-200">
            <Star className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 tracking-wide">Our Unique Edge</span>
          </div>
          
          <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
            What Makes Us{' '}
            <span className="text-transparent bg-clip-text bg-[#27514b] ">
              Different?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our diverse team of seasoned professionals brings together years
            of experience and a passion for driving success. We believe in
            building strong relationships and delivering personalized
            solutions.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                className={`relative group transition-all duration-700 delay-${index * 150} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background Glow */}
                <div className={`absolute -inset-2  rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                
                {/* Main Card */}
                <div className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-all duration-500 ${
                  isHovered ? 'border-emerald-200 shadow-2xl transform -translate-y-2' : 'border-gray-100 hover:border-gray-200'
                }`}>
                 
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0  to  rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                    <div className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-[#023c2d] mb-4 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {item.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-3">
                    {item.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className={`flex items-center gap-3 transition-all duration-300 delay-${featureIndex * 100} ${
                          isHovered ? 'translate-x-2' : ''
                        }`}
                      >
                        <CheckCircle className={`w-5 h-5 text-${item.accentColor}-500 flex-shrink-0`} />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bottom Accent */}
                  <div className={`mt-6 pt-4 border-t border-gray-100 transition-all duration-300 ${
                    isHovered ? 'border-emerald-200' : ''
                  }`}>
                    <div className={`w-12 h-1 bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-500 ${
                      isHovered ? 'w-24' : ''
                    }`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
        </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#023c2d] mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`transition-all duration-700 delay-${index * 200} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 shadow-xl rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#023c2d] mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The passionate people behind our mission
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`transition-all duration-700 delay-${index * 200 + 400} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-[#fdf1df] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2">
                <div className="relative inline-block mb-6">
                  <div className={`absolute inset-0  rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity`}></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-20 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Have questions about our platform? Want to partner with us? We'd love to hear from you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Email Us</div>
                    <a href="mailto:info@parrotconsult.com" className=' text-gray-300'>info@parrotconsult.com</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Call Us</div>
                    <a href="tell:8868864441" className=' text-gray-300'>8868864441</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Visit Us</div>
                    <a href="google.com/maps/place/FEBTECH+IT+SOLUTIONS+Pvt.+Ltd/@29.8845467,77.8633216,15z/data=!4m6!3m5!1s0x390eb51d58bca643:0x35e3e1db1d8a7707!8m2!3d29.8917664!4d77.8681671!16s%2Fg%2F11ppzl_txm?entry=ttu">Roorkee, India</a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div className="mb-8">
                  <label className="block text-white font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    isSubmitted
                      ? 'bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white'
                      : isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitted ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </span>
                  ) : isSubmitting ? (
                    'Sending...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
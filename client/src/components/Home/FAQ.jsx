import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// Animated components
const AnimatedStep = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(30px)'
      }}
    >
      {children}
    </div>
  );
};





const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full py-4 px-0 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <span className="text-[#023c2d] font-medium pr-4">{question}</span>
        <div className="transition-transform duration-200" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      </button>
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? '200px' : '0px',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="pb-4 text-gray-600 text-sm leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const faqData = [
  {
    id: 1,
    question: "What is Parrot Consult?",
    answer: "Parrot Consult is a platform that connects businesses and individuals with verified expert consultants across industries like legal, finance, IT, marketing, and more — all in one place."
  },
  {
    id: 2,
    question: "How does it work?",
    answer: "Simply choose your industry and business stage, answer a few quick questions, and we’ll recommend the best consultant for your needs. You can book a session directly through our platform."
  },
  {
    id: 3,
    question: "How much does it cost to consult?",
    answer: "Our consultations start at just ₹1 for the first session (limited-time offer). Prices may vary depending on the consultant and type of service."
  },
  {
    id: 4,
    question: "Who are the consultants?",
    answer: "All our consultants are verified professionals with expertise in their domains — including startup mentors, lawyers, marketing strategists, IT experts, and more."
  },
  {
    id: 5,
    question: "Can I become a consultant on Parrot?",
    answer: "Yes! If you're an expert in your field, you can apply to join as a consultant. Click “Join as Consultant” and complete the onboarding process."
  }
];


export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* FAQ Section */}
        <div>
          <AnimatedStep delay={1200}>
            <h2 className="text-4xl font-bold text-[#023c2d] mb-2">Frequently Asked</h2>
            <h2 className="text-4xl font-bold text-[#023c2d] mb-8">Questions</h2>
            <div className="w-24 h-1 bg-teal-600 mb-12"></div>
          </AnimatedStep>
          
          <AnimatedStep delay={1400}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden px-4">
              {faqData.map((faq) => (
                <FAQItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === faq.id}
                  onToggle={() => toggleFAQ(faq.id)}
                />
              ))}
            </div>
          </AnimatedStep>
        </div>
      </div>
    </div>
  );
}
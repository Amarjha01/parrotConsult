import React, { useEffect, useState , useRef  } from "react";
import { useLocation } from "react-router-dom";
import { getOpenAIResponse } from "../service/openaiApi";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ChatBot() {
  const query = useQuery().get("query"); // 🟢 initial question from search bar
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm Parry 🐦 — Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.flex-1.overflow-y-auto');
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // 🧠 Trigger auto-reply if query is passed in URL
  useEffect(() => {
    const initPrompt = async () => {
      if (!query) return;
       
      const newMessages = [
        ...messages,
        { sender: "user", text: query }
      ];

      
      setMessages(newMessages);
      setLoading(true);
      setIsTyping(true);

      setTimeout(() => scrollToBottom(), 300);

      try {
        const reply = await getOpenAIResponse(query);
        setMessages([...newMessages, { sender: "bot", text: reply }]);
        setTimeout(() => scrollToBottom(), 300);
      } catch {
        setMessages([...newMessages, { sender: "bot", text: "Oops! Something went wrong." }]);
        setTimeout(() => scrollToBottom(), 300);
      } finally {
        setLoading(false);
        setIsTyping(false);
      }
    };

    initPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  
  
const handleSend = async () => {
    const prompt = input.trim();
    if (!prompt) return;
  
    const newMessages = [...messages, { sender: "user", text: prompt }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setIsTyping(true);
    
    // Scroll after user message
    setTimeout(() => scrollToBottom(), 100);
  
    try {
      const reply = await getOpenAIResponse(prompt);
      setMessages([...newMessages, { sender: "bot", text: reply }]);
      // Scroll after bot response
      setTimeout(() => scrollToBottom(), 100);
    } catch {
      setMessages([...newMessages, { sender: "bot", text: "Perry failed to respond." }]);
      setTimeout(() => scrollToBottom(), 100);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden customeZindex ">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-float-delay opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float-delay-2 opacity-50"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-pink-400 rounded-full animate-float opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-float-delay opacity-70"></div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative scrollbar-custom">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 animate-slide-in ${
              msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 ${msg.sender === "user" ? "order-2" : ""}`}>
              {msg.sender === "bot" ? (
                <div className="relative group">
                  <div className=" bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
                  <img 
                    src="/parrot.jpg" 
                    alt="Parry" 
                    className="relative w-10 h-10 rounded-full shadow-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="relative group">
                  <div className=" bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                    <span className="text-white text-sm font-bold">You</span>
                  </div>
                </div>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-lg px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] group ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-purple-500/90 to-pink-500/90 text-white ml-auto border border-white/20"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/15"
              }`}
            >
              <p className="text-sm leading-relaxed group-hover:text-shadow-sm">{msg.text}</p>
              <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${
                msg.sender === "user" 
                  ? "from-purple-400 to-pink-400" 
                  : "from-emerald-400 to-teal-400"
              } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
            
          </div>
          
        ))}
        
        <div ref={messagesEndRef} />
        {/* Enhanced Typing indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3 animate-slide-in">
            <div className="relative group">
              <div className=" bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-60 animate-pulse"></div>
              <img 
                src="/parrot.jpg" 
                alt="Parry" 
                className="relative w-10 h-10 rounded-full shadow-xl ring-2 ring-white/20"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl border border-white/20 animate-pulse-gentle">
              <div className="flex space-x-2 items-center">
                <div className="flex space-x-1">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce shadow-lg"></div>
                  <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce delay-150 shadow-lg"></div>
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce delay-300 shadow-lg"></div>
                </div>
                <span className="text-emerald-300 text-xs ml-2 animate-fade">Perry is thinking...</span>
              </div>
            </div>
          </div>
          
        )}
        
      </div>

      {/* Enhanced Input Area */}
   <div className="w-full flex justify-center items-center gap-4 mb-28 lg:mb-5">
              <div className=" bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-300"></div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here..."
                className=" outline-none w-[80%] lg:w-[50%] p-5 pr-14 rounded-2xl border border-white/20 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300 resize-none backdrop-blur-xl bg-white/10 text-white placeholder-white/60 shadow-2xl focus:shadow-3xl"
                rows="1"
                style={{ minHeight: '60px', maxHeight: '120px' }}
              />
                <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="  bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 text-white  shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 p-2 rounded-full"
            >
              <div className=" bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </div>
            </button>
            </div>
            
          

      
    </div>
  );
}
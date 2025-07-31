import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Layers, 
  Settings, 
  CalendarCheck, 
  TrendingUp, 
  Clock, 
  Target,
  ArrowRight,
  Plus
} from "lucide-react";

const cardData = [
  {
    title: "Profile Completion",
    icon: <User size={24} />,
    value: "80%",
    subtitle: "Complete your profile",
    gradient: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
    progress: 80,
  },
  {
    title: "Scheduled Sessions",
    icon: <CalendarCheck size={24} />,
    value: "5",
    subtitle: "This week",
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    change: "+2",
  },
  {
    title: "Total Sessions",
    icon: <Layers size={24} />,
    value: "15",
    subtitle: "All time",
    gradient: "from-blue-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
    change: "+3",
  },
  {
    title: "Settings",
    icon: <Settings size={24} />,
    value: "Update",
    subtitle: "Configure preferences",
    gradient: "from-slate-500 to-gray-600",
    bgColor: "bg-gradient-to-br from-slate-50 to-gray-50",
  },
];

const quickActions = [
  { title: "Book Session", icon: <Plus size={20} />, color: "bg-blue-500" },
  { title: "View Calendar", icon: <CalendarCheck size={20} />, color: "bg-green-500" },
  { title: "Update Profile", icon: <User size={20} />, color: "bg-purple-500" },
  { title: "Analytics", icon: <TrendingUp size={20} />, color: "bg-orange-500" },
];

const DashboardCard = ({ title, icon, value, subtitle, gradient, bgColor, progress, change }) => (
  <motion.div
    className={`${bgColor} rounded-2xl p-6 border border-white/20 backdrop-blur-sm relative overflow-hidden group cursor-pointer`}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg`}>
          {icon}
        </div>
        {change && (
          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
            <TrendingUp size={14} />
            {change}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      
      {progress && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

const QuickActionCard = ({ title, icon, color }) => (
  <motion.button
    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-3">
      <div className={`${color} p-2 rounded-lg text-white`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
        {title}
      </span>
      <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 ml-auto" />
    </div>
  </motion.button>
);

const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulated user data - in real app, this would come from props or context
   const user = (JSON.parse(localStorage?.user));
    setUserName(user.fullName)
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900">
                  Good {currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 17 ? 'afternoon' : 'evening'}, {userName && userName.split(" ")[0].charAt(0).toUpperCase() + userName.split(" ")[0].slice(1)} 👋
                </h1>
                <p className="text-sm text-gray-600">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DashboardCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={20} className="text-blue-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <QuickActionCard {...action} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-green-500" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Session completed</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Profile updated</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New session booked</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Home, User, LogOut, Layers, ChevronRight, Zap } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserTie, FaWallet } from "react-icons/fa";
import { TbCalendarUser } from "react-icons/tb";

const user = localStorage.user ? JSON.parse(localStorage.user) : null;

const currentRole = user?.role || 'user';

const baseMenuItems = [
  { name: 'Dashboard', icon: <Home size={20} />, path: '/userdashboard/dashboard', color: 'from-blue-500 to-cyan-500' },
  { name: 'Profile', icon: <User size={20} />, path: '/userdashboard/profile', color: 'from-purple-500 to-pink-500' },
  { name: 'My Sessions', icon: <Layers size={20} />, path: '/userdashboard/sessions', color: 'from-emerald-500 to-teal-500' },
  { name: 'Profile Upgrade', icon: <FaUserTie size={20} />, path: '/userdashboard/consultantform', color: 'from-emerald-500 to-teal-500' },
];
console.log(currentRole);
const consultantItems = [
  { name: 'Booked Sessions', icon: <TbCalendarUser size={20} />, path: '/userdashboard/Bookedsessions', color: 'from-indigo-500 to-purple-500' },
  { name: 'Wallet', icon: <FaWallet size={20} />, path: '/userdashboard/wallet', color: 'from-pink-500 to-red-500' },
];

const menuItems = currentRole === 'consultant' ? [...baseMenuItems, ...consultantItems] : baseMenuItems;


const SideBar = ({ isNavbarOpen, handleNavbarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const currentItem = menuItems.find(item => location.pathname.includes(item.path));
    setActiveItem(currentItem?.name || '');
  }, [location.pathname]);

const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('consultant');
    localStorage.removeItem('admin');
    setUserRole(null);
    navigate('/');
  };
  return (
    <div className={`min-h-screen w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex flex-col lg:relative fixed lg top-0 transition-transform transform
        ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-40`}>
      <div className="absolute  bg-gradient-to-br from-emerald-600/5 via-transparent to-teal-600/5" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-teal-500/10 to-transparent rounded-full blur-2xl animate-pulse delay-1000" />

      <div className="relative py-8 px-6 border-b border-slate-700/50">
      <Link to={'/'}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="text-white" size={20} />
          </div>
          <div>
           
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Parrot Consult
            </h1>
           
            <p className="text-xs text-slate-400">Professional Dashboard</p>
          </div>
        </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 relative">
        {menuItems.map((item) => {
          const isActive = activeItem === item.name;
          const isHovered = hoveredItem === item.name;

          return (
            <div key={item.name} className="relative">
              <button
                onClick={() => {
                  setActiveItem(item.name);
                  navigate(item.path);
                }}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group overflow-hidden w-full text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                }`}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/50 to-white/20 rounded-r-full" />
                )}

                {!isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`} />
                )}

                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isHovered
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : 'bg-slate-700/50 text-slate-400 group-hover:text-white'
                }`}>
                  {item.icon}
                </div>

                <span className="flex-1 text-sm font-medium">{item.name}</span>

                <ChevronRight 
                  size={16} 
                  className={`transition-all duration-300 ${
                    isActive 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                  }`} />

                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 scale-0 rounded-xl group-active:scale-100 transition-transform duration-200" />
                </div>
              </button>

              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-sm -z-10" />
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">User</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium transition-all duration-300 group"
        >
          <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            <LogOut size={18} />
          </div>
          <span onClick={handleLogout} className="flex-1 text-left text-sm cursor-pointer">Logout</span>
          <ChevronRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </button>
      </div>

      <div className="px-4 pb-4">
        <p className="text-xs text-slate-500 text-center">v2.1.0</p>
      </div>
    </div>
  );
};

export default SideBar;

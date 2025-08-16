import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Home,
  Search,
  PlusSquare,
  MessageCircle,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import ScrollToTop from './util/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
const navItems = [
  { name: 'Home', icon: <Home size={20} />, path: '/', color: 'hover:bg-[#1a5a3e]' },
  { name: 'Search', icon: <Search size={20} />, path: '/chatbot', color: 'hover:bg-[#1a5a3e]' },
  { name: 'Quickify', icon: <SiGoogledisplayandvideo360 size={20} />, path: '/reels', color: 'hover:bg-[#1a5a3e]' },
  { name: 'Inbox', icon: <MessageCircle size={20} />, path: '/inbox', color: 'hover:bg-[#1a5a3e]' },
];

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [active, setActive] = useState();
const navigate = useNavigate();
const location = useLocation();

console.log(location.pathname);

   useEffect(() => {
  const currentNav = navItems.find(item => item.path === location.pathname);
  if (currentNav) {
    console.log(currentNav);
    
    setActive(currentNav.name);
  }
}, [location.pathname]);
 
 



  useEffect(() => {
    const updateRole = () => {
      const consultant = localStorage.getItem("consultant");
      const user = localStorage.getItem("user");
      if (consultant) setUserRole("consultant");
      else if (user) setUserRole("user");
      else setUserRole(null);
    };
    updateRole();
    window.addEventListener("storage", updateRole);
    return () => window.removeEventListener("storage", updateRole);
  }, []);

  const handleDashboard = () => {
    if (userRole === 'consultant') navigate('/userdashboard/dashboard');
    else if (userRole === 'user') navigate('/userdashboard/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('consultant');
    localStorage.removeItem('admin');
    setUserRole(null);
    navigate('/');
  };

  const NavButton = ({ name, icon, path }) => (
    <button
      onClick={() => {
        setActive(name);
        navigate(path);
      }}
      className={`relative flex items-center w-full p-3 my-1 rounded-xl font-medium transition-all duration-300 transform hover:scale-102 active:scale-98 group ${
        active === name
          ? 'bg-[#227047] text-white'
          : 'text-gray-100 hover:text-white hover:bg-[#1a5a3e]'
      }`}
    >
      <div className="relative flex items-center justify-center w-6 h-6 min-w-[24px]">
        {icon}
        {name === 'Notifications' && hasNotifications && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping" />
        )}
      </div>
      <span className={`ml-3 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
        {name}
      </span>
      {active === name && <div className="absolute right-0 top-0 h-full w-1 bg-white rounded-l-full" />}
    </button>
  );

  const ActionButton = ({ icon, onClick, color, bgColor, label }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center w-full p-3 my-1 rounded-xl font-medium transition-all duration-300 transform hover:scale-102 active:scale-98 ${
        color || 'text-gray-100 hover:text-white'
      } ${bgColor || 'hover:bg-[#1a5a3e]'}`}
    >
      <div className="flex items-center justify-center w-6 h-6 min-w-[24px]">{icon}</div>
      <span className={`ml-3 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <>
      <ScrollToTop />
       <ToastContainer />
      <div className="flex md:min-h-screen ">
        {/* Sidebar (Desktop only) */}
        <aside
          className={`hidden md:flex fixed min-h-screen flex-col border-r border-[#103e37] bg-[#103e37]/90 backdrop-blur-lg shadow-xl z-50 transition-all duration-300 ease-in-out ${
            isExpanded ? 'w-64' : 'w-20'
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-evenly">
              <Link to={'/'} className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ">
                <img src="/parrot.png" alt="" />
              </Link>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-hidden">
            {navItems.map(item => <NavButton key={item.name} {...item} />)}
          </nav>
          <div className="p-4 border-t border-gray-200 space-y-2">
            {!userRole ? (
              <ActionButton
                icon={<User size={20} />}
                onClick={() => navigate('/newsignin')}
                color="text-emerald-600 hover:text-emerald-800"
                bgColor="hover:bg-emerald-50"
                label="Login"
              />
            ) : (
              <>
                <ActionButton
                  icon={<LayoutDashboard size={20} />}
                  onClick={handleDashboard}
                  color="text-emerald-600 hover:text-emerald-800"
                  bgColor="hover:bg-emerald-50"
                  label="Dashboard"
                />
                <ActionButton icon={<Settings size={20} />} onClick={() => navigate('/settings')} label="Settings" />
                <ActionButton
                  icon={<LogOut size={20} />}
                  onClick={handleLogout}
                  color="text-red-500 hover:text-red-700"
                  bgColor="hover:bg-red-50"
                  label="Logout"
                />
              </>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className="flex-1 ml-0 md:ml-20 overflow-x-hidden  md:pt-2  sm:pl-2 bg-[#fefaee]"
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-green-900/10 backdrop-blur-lg border-t border-green-900/20 shadow-lg z-50">
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.slice(0, 4).map(item => (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name);
                navigate(item.path);
              }}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                active === item.name ? 'text-white bg-[#227047]/90' : 'text-green-900 hover:text-white'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.name === 'Notifications' && hasNotifications && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          ))}

          <button
            onClick={() => navigate(userRole ? '/userdashboard/dashboard' : '/newsignin')}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-green-900 hover:text-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <User size={20} />
            <span className="text-xs font-medium">{userRole ? 'Profile' : 'Login'}</span>
          </button>
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      {/* <div className="md:hidden h-20" /> */}
    </>
  );
};

export default App;

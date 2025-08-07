import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SideBar from '../components/userDashboard/SideBar';
import { Menu, X, Home } from 'lucide-react';

const ClientDashboard = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavbarOpen = () => {
    setIsNavbarOpen(prev => !prev);
  };

  const goHome = () => {
    navigate('/'); 
  };

  return (
    <div>
      {/* Mobile Header with Hamburger and Home */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow">
        <button onClick={goHome} className="mr-4 text-blue-600 hover:text-blue-800">
          <Home size={24} />
        </button>
        <button onClick={handleNavbarOpen}>
          {isNavbarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="lg:flex">
        <SideBar isNavbarOpen={isNavbarOpen} handleNavbarOpen={handleNavbarOpen} />

        {/* Content Area */}
        <div
          className={`
            p-6 bg-gray-50 
            absolute w-[100vw] h-[100vh] 
            lg:static lg:w-auto lg:h-auto lg:flex-1
          `}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

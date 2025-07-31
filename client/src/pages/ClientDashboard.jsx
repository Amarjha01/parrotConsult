import React, { useState } from 'react';
import SideBar from '../components/userDashboard/SideBar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const ClientDashboard = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleNavbarOpen = () => {
    setIsNavbarOpen(prev => !prev);
  };

  return (
    <div>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden flex justify-end items-center p-4 bg-white shadow">
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

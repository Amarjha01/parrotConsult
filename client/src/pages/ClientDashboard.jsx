import React, { useState } from 'react';
import SideBar from '../components/userDashboard/SideBar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // or use any icon lib

const ClientDashboard = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleNavbarOpen = () => {
    setIsNavbarOpen(prev => !prev);
  };

  return (
    <div>
      <div className="lg:hidden flex justify-end items-center p-4 bg-white shadow">
        <button onClick={handleNavbarOpen}>
          {isNavbarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className=" lg:flex">
        <SideBar isNavbarOpen={isNavbarOpen} handleNavbarOpen={handleNavbarOpen} />
        <div className="lg:flex-1 bg-gray-50 p-6 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

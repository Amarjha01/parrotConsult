import React from 'react'
import SideBar from '../components/userDashboard/SideBar'
import UserDashboard from '../components/userDashboard/Dashboard'
import { Outlet } from 'react-router-dom'

const ClientDashboard = () => {
  return (
    <div>
      <div className="flex"> <SideBar /> 
      <div className="flex-1 bg-gray-50 p-6">
        <Outlet />
        </div> 
        
        </div>
    </div>
  )
}

export default ClientDashboard
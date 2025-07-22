import React, { useState, useEffect } from "react";

import {
  getallunapprovedconsultants,
  adminapproveconsultant,
  adminrejectconsultant,
  logout,
} from "../apis/adminApi";
import DashboardOverview from "../components/admindashboard/dashoverview";
import { Sidebar } from "../components/admindashboard/sidebar";
import { Header } from "../components/admindashboard/header";
import { ConsultantsManagement } from "../components/admindashboard/consultantmanagement";
import { SettingsPanel } from "../components/admindashboard/settingPannel";
import { adminSeeAllBookings } from "../apis/adminApi"; // adjust path if needed

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeBookingTab, setActiveBookingTab] = useState("upcoming");

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const response = await getallunapprovedconsultants();
      setConsultants(response.data || response);
    } catch (error) {
      console.error("Error fetching consultants:", error);
      showNotification("Failed to fetch consultants", "error");
    } finally {
      setLoading(false);
    }
  };

  // const fetchBookings = async () => {
  //   try {
  //     const response = await adminSeeAllBookings();
  //     setBookings(response.data || response);
  //     console.log("Upcoming Bookings:", response);
  //   } catch (error) {
  //     console.error("Error fetching bookings:", error);
  //     showNotification("Failed to fetch bookings", "error");
  //   }
  // };

  const fetchBookings = async () => {
    try {
      const response = await adminSeeAllBookings();
      const bookingsData = response?.data;
      console.log("✅ Bookings fetched:", response.data);

  
      if (Array.isArray(bookingsData)) {
        setBookings(bookingsData);
      } else {
        console.warn("⚠️ Expected bookings array, got:", bookingsData);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showNotification("Failed to fetch bookings", "error");
    }
  };
  
  const handleApprove = async (consultantId) => {
    try {
      setLoading(true);
      const response = await adminapproveconsultant(consultantId);
      setConsultants((prev) => prev.filter((c) => c._id !== consultantId));
      showNotification(response.message || "Consultant approved successfully");
    } catch (error) {
      console.error("Error approving consultant:", error);
      showNotification(
        error.message || "Failed to approve consultant",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (consultantId) => {
    try {
      setLoading(true);
      const response = await adminrejectconsultant(consultantId);
      setConsultants((prev) => prev.filter((c) => c._id !== consultantId));
      showNotification(response.message || "Consultant rejected successfully");
    } catch (error) {
      console.error("Error rejecting consultant:", error);
      showNotification(error.message || "Failed to reject consultant", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      showNotification(response.message || "Logged out successfully");
      // Redirect to login page or clear auth state
      window.location.href = "/adminsecuredlogin";
    } catch (error) {
      console.error("Logout error:", error);
      showNotification(error.message || "Logout failed", "error");
    }
  };

  useEffect(() => {
    fetchConsultants();
    fetchBookings();
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case "consultants":
        return "Consultant Management";
      case "bookings":
        return "All Bookings";
      case "settings":
        return "Settings";
      default:
        return "Dashboard Overview";
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) { 
      case "consultants":
        case "rejected":
        return (
          <ConsultantsManagement
            consultants={consultants}
            onApprove={handleApprove}
            onReject={handleReject}
            loading={loading}
            onRefresh={fetchConsultants}
            activeTab={activeTab}
          />
        );

      // case "bookings":
      //   return (
      //     <div className="space-y-6 p-6">
      //       {bookings.length === 0 ? (
      //         <div className="flex flex-col items-center justify-center py-16 px-8">
      //           <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
      //             <svg
      //               className="w-12 h-12 text-blue-500"
      //               fill="none"
      //               stroke="currentColor"
      //               viewBox="0 0 24 24"
      //             >
      //               <path
      //                 strokeLinecap="round"
      //                 strokeLinejoin="round"
      //                 strokeWidth={2}
      //                 d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      //               />
      //             </svg>
      //           </div>
      //           <h3 className="text-xl font-semibold text-white mb-2">
      //             No Bookings Yet
      //           </h3>
      //           <p className="text-gray-300 text-center max-w-md">
      //             When consultations are booked, they'll appear here with all
      //             the details.
      //           </p>
      //         </div>
      //       ) : (
      //         <>
      //           <div className="flex items-center justify-between mb-8">
      //             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
      //               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
      //                 <svg
      //                   className="w-5 h-5 text-white"
      //                   fill="none"
      //                   stroke="currentColor"
      //                   viewBox="0 0 24 24"
      //                 >
      //                   <path
      //                     strokeLinecap="round"
      //                     strokeLinejoin="round"
      //                     strokeWidth={2}
      //                     d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      //                   />
      //                 </svg>
      //               </div>
      //               Bookings
      //             </h2>
      //             <div className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">
      //               {bookings.length}{" "}
      //               {bookings.length === 1 ? "booking" : "bookings"}
      //             </div>
      //           </div>

      //           <div className="grid gap-6">
      //             {bookings.map((booking) => (
      //               <div
      //                 key={booking._id}
      //                 className="group bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
      //               >
      //                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      //                   {/* Left side - Main info */}
      //                   <div className="flex-1">
      //                     <div className="flex items-start gap-4 mb-4">
      //                       <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
      //                         <svg
      //                           className="w-6 h-6 text-white"
      //                           fill="none"
      //                           stroke="currentColor"
      //                           viewBox="0 0 24 24"
      //                         >
      //                           <path
      //                             strokeLinecap="round"
      //                             strokeLinejoin="round"
      //                             strokeWidth={2}
      //                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      //                           />
      //                         </svg>
      //                       </div>
      //                       <div className="flex-1 min-w-0">
      //                         <h3 className="text-lg font-semibold text-gray-900 mb-1">
      //                           {booking.user?.name || "Unknown User"}
      //                         </h3>
      //                         <p className="text-sm text-gray-600">
      //                           with{" "}
      //                           <span className="font-medium text-gray-800">
      //                             {booking.consultant?.name ||
      //                               "Unknown Consultant"}
      //                           </span>
      //                         </p>
      //                       </div>
      //                     </div>

      //                     {/* Date and Time */}
      //                     <div className="flex items-center gap-2 text-gray-700 mb-3">
      //                       <svg
      //                         className="w-4 h-4 text-gray-500"
      //                         fill="none"
      //                         stroke="currentColor"
      //                         viewBox="0 0 24 24"
      //                       >
      //                         <path
      //                           strokeLinecap="round"
      //                           strokeLinejoin="round"
      //                           strokeWidth={2}
      //                           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      //                         />
      //                       </svg>
      //                       <span className="text-sm font-medium">
      //                         {booking.datetime
      //                           ? new Date(booking.datetime).toLocaleString(
      //                               "en-US",
      //                               {
      //                                 weekday: "short",
      //                                 year: "numeric",
      //                                 month: "short",
      //                                 day: "numeric",
      //                                 hour: "2-digit",
      //                                 minute: "2-digit",
      //                               }
      //                             )
      //                           : "Date not available"}
      //                       </span>
      //                     </div>
      //                   </div>

      //                   {/* Right side - Status */}
      //                   <div className="flex items-center gap-3">
      //                     <div
      //                       className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 ${
      //                         booking.status === "confirmed"
      //                           ? "bg-green-100 text-green-800 border border-green-200"
      //                           : booking.status === "pending"
      //                           ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
      //                           : booking.status === "cancelled"
      //                           ? "bg-red-100 text-red-800 border border-red-200"
      //                           : "bg-gray-100 text-gray-800 border border-gray-200"
      //                       }`}
      //                     >
      //                       <div
      //                         className={`w-2 h-2 rounded-full ${
      //                           booking.status === "confirmed"
      //                             ? "bg-green-500"
      //                             : booking.status === "pending"
      //                             ? "bg-yellow-500"
      //                             : booking.status === "cancelled"
      //                             ? "bg-red-500"
      //                             : "bg-gray-500"
      //                         }`}
      //                       ></div>
      //                       {booking.status || "Unknown"}
      //                     </div>

      //                     {/* Action button */}
      //                     <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100 rounded-full">
      //                       <svg
      //                         className="w-4 h-4 text-gray-500"
      //                         fill="none"
      //                         stroke="currentColor"
      //                         viewBox="0 0 24 24"
      //                       >
      //                         <path
      //                           strokeLinecap="round"
      //                           strokeLinejoin="round"
      //                           strokeWidth={2}
      //                           d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      //                         />
      //                       </svg>
      //                     </button>
      //                   </div>
      //                 </div>

      //                 {/* Bottom border accent */}
      //                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      //               </div>
      //             ))}
      //           </div>
      //         </>
      //       )}
      //     </div>
      //   );

      case "bookings":
        const now = new Date();
        

        const upcomingBookings = bookings.filter(
          (b) => new Date(b.datetime) > now
        );
        const pastBookings = bookings.filter(
          (b) => new Date(b.datetime) <= now
        );

        // const renderBookingCards = (list) => (
        //   <div className="grid gap-6">
        //     {list.map((booking) => (
        //       <div
        //         key={booking._id}
        //         className="group bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
        //       >
        //         {/* same existing card UI as you already have */}
        //         {/* keep your current booking display code here */}
                
        //       </div>
        //     ))}
        //   </div>
        // );
        
        const renderBookingCards = (list) => {
          if (list.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-16 px-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
                <p className="text-gray-300 text-center max-w-md">
                  When consultations are booked, they'll appear here with all the details.
                </p>
              </div>
            );
          }
        
          return (
            <div className="grid gap-6">
              {list.map((booking) => (
                <div
                  key={booking._id}
                  className="relative group bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left side */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.user?.name || "Unknown User"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            with{" "}
                            <span className="font-medium text-gray-800">
                              {booking.consultant?.name || "Unknown Consultant"}
                            </span>
                          </p>
                        </div>
                      </div>
        
                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-gray-700 mb-3">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          {booking.datetime
                            ? new Date(booking.datetime).toLocaleString("en-IN", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Date not available"}
                        </span>
                      </div>
                    </div>
        
                    {/* Right side - status & actions */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-500"
                              : booking.status === "pending"
                              ? "bg-yellow-500"
                              : booking.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                        {booking.status || "Unknown"}
                      </div>
        
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100 rounded-full">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
        
                  {/* Bottom hover accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          );
        };
        
        return (
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Bookings
              </h2>
              <div className="flex space-x-2 bg-white/10 p-1 rounded-full">
                <button
                  className={`px-4 py-1.5 rounded-full font-medium text-sm ${
                    activeBookingTab === "upcoming"
                      ? "bg-white text-green-800"
                      : "text-white"
                  }`}
                  onClick={() => setActiveBookingTab("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-1.5 rounded-full font-medium text-sm ${
                    activeBookingTab === "past"
                      ? "bg-white text-green-800"
                      : "text-white"
                  }`}
                  onClick={() => setActiveBookingTab("past")}
                >
                  Past
                </button>
              </div>
            </div>

            {activeBookingTab === "upcoming"
              ? renderBookingCards(upcomingBookings)
              : renderBookingCards(pastBookings)}
          </div>
        );

      case "settings":
        return <SettingsPanel />;
      default:
        return (
          <DashboardOverview consultants={consultants} bookings={bookings} />
        );
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} />

        <main className="flex-1 overflow-y-auto p-6">{renderActiveTab()}</main>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

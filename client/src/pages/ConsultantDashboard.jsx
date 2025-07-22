import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  MoreHorizontal,
  LogOut,
  Home,
  Edit3,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  Menu,
} from "lucide-react";
import { loginAsConsultant } from "../apis/consultantApi";
import { getBookingsByConsultantId } from "../apis/bookingApi";
import BookingCard from "./consultantdash/bookingcard";
import EditConsultantProfile from "../forms/editconsultant";

// Reusable Card Component
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
  >
    {children}
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
    <span className="ml-2 text-gray-600">Loading dashboard...</span>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <p className="text-red-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

const Sidebar = ({
  activeItem,
  setActiveItem,
  consultantData,
  onLogout,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "profile", label: "Edit Profile", icon: User },
    { id: "more", label: "More", icon: MoreHorizontal },
  ];

  return (
    <div
      className={`fixed z-40 h-full lg:static top-0 left-0  w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 shadow-xl transition-transform duration-300 ease-in-out transform flex flex-col justify-between ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Top Content */}
      <div className="p-6 space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg"></div>
          </div>
          <div>
            <a href="/">
              <h1 className="text-lg font-bold text-white">PARROT</h1>
            </a>
            <p className="text-xs text-emerald-100 font-medium">CONSULT</p>
          </div>
        </div>

        {/* Consultant Info */}
        {consultantData && (
          <div className="p-4 bg-gray-800 rounded-xl border border-gray-600 shadow">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={
                    consultantData.data.profilePicture ||
                    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                  }
                  alt={consultantData.data.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow"
                />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-800"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white truncate">
                  {consultantData.data.name}
                </p>
                <p className="text-xs text-gray-300 capitalize truncate">
                  {consultantData.data.primaryCategory}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveItem(id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                activeItem === id
                  ? "bg-emerald-600 text-white font-semibold shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={`${
                  activeItem === id
                    ? "text-white"
                    : "text-gray-400 group-hover:text-emerald-400"
                }`}
              />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="p-6 pt-0">
        <button
          onClick={() => {
            onLogout();
            setMobileOpen(false);
          }}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200 w-full"
        >
          <LogOut size={20} className="group-hover:text-red-400" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color = "emerald" }) => {
  const colorClasses = {
    emerald:
      "text-emerald-600 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200",
    blue: "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    purple:
      "text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
  };

  return (
    <Card className="p-6 hover:transform hover:scale-105 transition-all duration-300 border-l-4 border-l-emerald-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
        </div>
        <div
          className={`p-4 rounded-2xl ${colorClasses[color]} border shadow-lg`}
        >
          <Icon size={28} />
        </div>
      </div>
    </Card>
  );
};

// Welcome Header Component
const WelcomeHeader = ({ consultantData }) => (
  <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl text-white">
    <div>
      <h1 className="text-4xl font-bold mb-2">
        Welcome back, {consultantData?.data.name || "Consultant"} 👋
      </h1>
      <p className="text-emerald-100 mb-3 text-lg capitalize">
        {consultantData?.data.primaryCategory} •{" "}
        {consultantData?.data.experience} years experience
      </p>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
            consultantData?.data.status === "approved"
              ? "bg-green-500 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {consultantData?.data.status === "approved"
            ? "✓ Approved"
            : "⏳ Pending Approval"}
        </span>
        {consultantData?.data.visibleOnPlatform && (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 text-white shadow-lg">
            🌟 Live on Platform
          </span>
        )}
      </div>
    </div>
    <div className="relative">
      <img
        src={
          consultantData?.data.profilePicture ||
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        }
        alt={consultantData?.data.name}
        className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-2xl"
      />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg"></div>
    </div>
  </div>
);

// Overview Section Component
const OverviewSection = ({ stats }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
      <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  </div>
);

const UpcomingBookingsSection = ({ bookings }) => (
  <div>
    <div className="flex items-center gap-3 mb-8">
      <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
      <h2 className="text-2xl font-bold text-gray-900">Upcoming Sessions</h2>
    </div>
    <div className="grid gap-6">
      {bookings.length > 0 ? (
        bookings.map((booking, index) => {
          const dateObj = new Date(booking.datetime);
          const formattedDate = dateObj.toLocaleDateString();
          const formattedTime = dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <BookingCard
              key={booking._id}
              booking={{
                datetime: booking.datetime,
                duration: booking.duration,
                user: {
                  name: booking.user.name,
                  profilePicture:
                    booking.user.profilePicture ||
                    "https://via.placeholder.com/150",
                },
                projectDetails: booking.projectDetails,
                _id: booking._id,
              }}
            />
          );
        })
      ) : (
        <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No upcoming bookings
            </h3>
            <p className="text-gray-600 mb-4">
              Your schedule is clear! New bookings will appear here once clients
              book your services.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto"></div>
          </div>
        </Card>
      )}
    </div>
  </div>
);

// Services Section Component
const ServicesSection = ({ services }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
      <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service, index) => (
        <Card
          key={index}
          className="p-5 hover:transform hover:scale-[1.02] transition-all duration-200 border-l-4 border-l-purple-500"
        >
          <p className="font-semibold text-gray-900 text-lg">{service}</p>
          <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
        </Card>
      ))}
    </div>
  </div>
);

// Main Dashboard Component
const ConsultantDashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [consultantData, setConsultantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Function to load consultant data
  const loadConsultantData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First check if consultant data exists in localStorage
      const storedData = localStorage.getItem("consultant");
      const accessToken = localStorage.getItem("accessToken");

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Loaded consultant data from localStorage:", parsedData);
        setConsultantData(parsedData);
        setLoading(false);
        return;
      }

      // If no stored data but we have access token, try to fetch from API
      if (accessToken) {
        try {
          // You might need to create a separate API call to get consultant profile
          // For now, we'll check if there's any way to retrieve the consultant data
          console.log(
            "Access token found, but no consultant data in localStorage"
          );
          setError(
            "Session found but consultant data missing. Please log in again."
          );
        } catch (apiError) {
          console.error("API Error:", apiError);
          setError("Failed to load consultant data from server.");
        }
      } else {
        // No stored data and no access token
        setError("No consultant session found. Please log in again.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading consultant data:", err);
      setError("Failed to load consultant data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultantData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("consultant");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Redirect to login page
    window.location.href = "/login";
  };

  // Generate stats data based on consultant data
  const generateStatsData = (consultantData) => {
    if (!consultantData) return [];

    return [
      {
        title: "Hourly Rate",
        value: `₹ ${consultantData.data.hourlyRate || "0"}`,
        icon: DollarSign,
        color: "emerald",
      },
      {
        title: "Availability/Week",
        value: `${consultantData.data.availabilityPerWeek || "0"}h`,
        icon: Clock,
        color: "blue",
      },
      {
        title: "Languages",
        value:
          consultantData.data.languageProficiency?.length?.toString() || "0",
        icon: User,
        color: "purple",
      },
      {
        title: "Key Skills",
        value: consultantData.data.keySkills?.length?.toString() || "0",
        icon: Eye,
        color: "emerald",
      },
    ];
  };

  // Generate upcoming bookings (placeholder - you'll need to fetch from API)
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (consultantData?.data?._id) {
        try {
          const bookingData = await getBookingsByConsultantId(
            consultantData.data._id
          );
          setBookings(bookingData);
          console.log("Upcoming Bookings:", bookingData);
        } catch (err) {
          console.error("Failed to load bookings", err);
        }
      }
    };

    fetchBookings();
  }, [consultantData]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={loadConsultantData} />;
    }

    const statsData = generateStatsData(consultantData);
    const upcomingBookings = bookings;

    switch (activeItem) {
      case "dashboard":
        return (
          <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
            <WelcomeHeader consultantData={consultantData} />
            <OverviewSection stats={statsData} />
            {consultantData?.specializedServices && (
              <ServicesSection services={consultantData.specializedServices} />
            )}
            <UpcomingBookingsSection bookings={upcomingBookings} />
          </div>
        );
      case "bookings":
        return (
          <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
            </div>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking, index) => {
                console.log("Booking:", booking);

                const dateObj = new Date(booking.datetime);
                const formattedDate = dateObj.toLocaleDateString();
                const formattedTime = dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <BookingCard
                    key={booking._id || index}
                    booking={{
                      clientName: booking.user.name,
                      service: booking.projectDetails,
                      date: formattedDate,
                      time: formattedTime,
                      clientAvatar: "https://via.placeholder.com/150",
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-10 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
            </div>
            <Card className="p-8">
              <EditConsultantProfile consultantData={consultantData} />
            </Card>
          </div>
        );
      default:
        return (
          <div className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              More Options
            </h1>
            <div className="grid gap-6">
              <Card className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Settings
                </h3>
                <div className="space-y-3">
                  <button className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
                    Notification Preferences
                  </button>
                  <button className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
                    Privacy Settings
                  </button>
                  <button className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
                    Payment Settings
                  </button>
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Documents
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Aadhaar Card</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        consultantData?.data.documents?.aadhaarCard
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {consultantData?.data.documents?.aadhaarCard
                        ? "Uploaded"
                        : "Not Uploaded"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">PAN Card</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        consultantData?.data.documents?.panCard
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {consultantData?.data.documents?.panCard
                        ? "Uploaded"
                        : "Not Uploaded"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Resume</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        consultantData?.data.resume
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {consultantData?.data.resume
                        ? "Uploaded"
                        : "Not Uploaded"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Mobile Nav Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md bg-gray-900 text-white shadow-md"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        ></div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
        <Sidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          consultantData={consultantData}
          onLogout={handleLogout}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {renderContent()}
      </div>
    </>
  );
};

export default ConsultantDashboard;

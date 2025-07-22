import React, { useState, useEffect } from "react";
import {
  X,
} from "lucide-react";
import { globalconsultantdetails } from "../apis/globalApi";
import {
  confirmBooking,
  createOrder,
  creatependingBooking,
} from "../apis/bookingApi";
import AuthModal from "./AuthModal";

const ConsultantBookingForm = ({ isOpen, onClose, preSelectedConsultant = null }) => {
  const [step, setStep] = useState(1);
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
const now = new Date();
const [selectedDate, setSelectedDate] = useState(now);
const [selectedTime, setSelectedTime] = useState(now);
const [showAuthModal, setShowAuthModal] = useState(false);
const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [duration, setDuration] = useState(30);
  const [projectDetails, setProjectDetails] = useState(""); // Dummy value
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(!preSelectedConsultant);
  const [error, setError] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (preSelectedConsultant) {
      setSelectedConsultant(preSelectedConsultant);
      setStep(2);
      setLoading(false);
    }
  }, [preSelectedConsultant]);

  useEffect(() => {
    if (preSelectedConsultant) return;
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const response = await globalconsultantdetails();
        setConsultants(response?.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching consultants:", err);
        setError("Failed to load consultants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, [preSelectedConsultant]);

  const generateTimeSlots = (date) => {
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const availability = selectedConsultant?.weeklyAvailability?.find(
      (entry) => entry.day === weekday && entry.isActive
    );
    if (!availability) return [];
    const slots = [];
    for (const range of availability.timeSlots) {
      const [startHour, startMinute] = range.start.split(":").map(Number);
      const [endHour, endMinute] = range.end.split(":").map(Number);
      const start = new Date(date);
      start.setHours(startHour, startMinute, 0, 0);
      const end = new Date(date);
      end.setHours(endHour, endMinute, 0, 0);
      while (start < end) {
        slots.push(new Date(start));
        start.setMinutes(start.getMinutes() + 30);
      }
    }
    return slots;
  };

  const handleDateSelect = (date) => {
    if (date < new Date().setHours(0, 0, 0, 0)) return;
    setSelectedDate(date);
    setAvailableSlots(generateTimeSlots(date));
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };



  // ------------------------handle booking ----------------------------
 const handleBookingSubmit = async () => {
  setIsBookingLoading(true);
  if (!projectDetails.trim()) {
    setError("Project details cannot be empty.");
    setIsBookingLoading(false);
    return;
  }

  try {
    const datetime = new Date(selectedDate);
    datetime.setHours(selectedTime.getHours());
    datetime.setMinutes(selectedTime.getMinutes());

    const amount = 100; // ₹1 in paise
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
    const userName = user?.name;
    const userEmail = user?.email;

    if (!user) {
      setIsBookingLoading(false);
   setShowAuthModal(true);
      return;
    }

    const pendingBooking = await creatependingBooking({
      consultantId: selectedConsultant._id,
      userId,
      duration,
      datetime,
      projectDetails,
    });

    const bookingId = pendingBooking.data._id;

    const razorpayOrder = await createOrder({ amount });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.data.amount,
      currency: "INR",
      order_id: razorpayOrder.data.id,
      name: "Snap Forge",
      description: "Consultation Booking",
    handler: async function (response) {
  try {
    await confirmBooking({
      bookingId,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    });

    setBookingComplete(true);
    setStep(4); // Optional: if you still want to show a success step

    // ✅ Redirect to dashboard (or thank-you page)
    window.location.href = "/userdashboard"; // Or use navigate("/dashboard") if using React Router
  } catch (error) {
    console.error("Booking confirmation failed", error);
    setError("Payment succeeded but booking confirmation failed. Contact support.");
  }
}
,
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: "#0d9488",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Booking/payment error:", err);
    setError("Something went wrong. Please try again.");
  }
};


  const resetForm = () => {
    setStep(1);
    setSelectedConsultant(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setDuration(30);
    setProjectDetails("");
    setBookingComplete(false);
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Book Consultation</h1>
          <button onClick={handleClose} className="hover:bg-gray-100 p-2 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Input field for project details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Details
            </label>
            <input
              type="text"
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Kindly enter the topic here....."
            />
          </div>
<button
  onClick={handleBookingSubmit}
  className="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700 cursor-pointer"
>
   Pay ₹1 to confirm Booking
</button>

<AuthModal 
  isOpen={showAuthModal} 
  onClose={() => setShowAuthModal(false)} 
/>

        </div>
      </div>
    </div>
  );
};

export default ConsultantBookingForm;

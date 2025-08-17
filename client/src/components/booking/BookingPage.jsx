import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, MessageCircle } from 'lucide-react';
import { createBooking, verifyPayment } from '../../apis/bookingApi';
import { showErrorToast } from '../../util/Notification';

const BookingPage = ({ isOpen = true, onClose = () => {}, consultant}) => {
  const [selectedDuration, setSelectedDuration] = useState('5');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationDetails, setConsultationDetails] = useState('');
  const [availableDates, setAvailableDates] = useState();
  console.log(' booking' , consultant);
  console.log(availableDates);
  
useEffect(() => {
  const consultantDays = consultant?.consultantRequest?.consultantProfile?.days?.map(day => day.trim());

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      if (consultantDays?.includes(dayName)) {
        dates.push({
          date: date.toISOString().split('T')[0],
          dayName,
          displayDate: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        });
      }
    }

    return dates;
  };

  const generatedDates = generateAvailableDates();
  setAvailableDates(generatedDates);
}, [consultant]);



 const generateTimeSlots = (startTimeStr, endTimeStr) => {
  const slots = [];

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':');
    minutes = minutes || '00';

    let hrs = parseInt(hours, 10);
    if (modifier.toLowerCase() === 'pm' && hrs < 12) hrs += 12;
    if (modifier.toLowerCase() === 'am' && hrs === 12) hrs = 0;

    const date = new Date('2000-01-01');
    date.setHours(hrs);
    date.setMinutes(parseInt(minutes));
    return date;
  };

  const startTime = parseTime(startTimeStr);
  const endTime = parseTime(endTimeStr);

  while (startTime < endTime) {
    const hours = startTime.getHours().toString().padStart(2, '0');
    const minutes = startTime.getMinutes().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
    startTime.setMinutes(startTime.getMinutes() + 30);
  }

  return slots;
};
const availableTimePerDay = "9 AM - 3 PM";

const getAvailableTimesForDate = () => {
  const [start, end] = availableTimePerDay.split('-').map(t => t.trim());
  return generateTimeSlots(start, end);
};


const handleBookMeeting = async () => {
  console.log('yha call hua');
  
 const user = JSON.parse(localStorage.getItem("user") || "null");
  console.log(user);
  
if(!user){
  showErrorToast('Please login to book meeting');
  setTimeout(() => {
    window.open("/newsignin", "_blank");

  }, 2000);
}
  const combinedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

  const payload = {
    datetime: combinedDateTime,
    duration: selectedDuration,
    consultationDetail: consultationDetails,
    consultantId: consultant._id,
    userId: user._id,
  };

  try {
    const response = await createBooking(payload);
    console.log("Booking response:", response);

    const { bookingId, razorpayOrder } = response.data;

    if (razorpayOrder && razorpayOrder.id) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "ParrotConsult",
        description: "Consultation Fee",
        order_id: razorpayOrder.id,

        handler: async function (paymentResult) {
          console.log(paymentResult);
          
          try {
            const verifyPayload = {
              bookingId,
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_signature: paymentResult.razorpay_signature,
              userId: user._id,
              consultantId: consultant._id,
              amount: razorpayOrder.amount,
            };

            const paymentResponse = await verifyPayment(verifyPayload);
            console.log("Payment success:", paymentResponse);
            alert("✅ Payment Successful! Booking confirmed.");
            window.location.href = 'userdashboard/sessions';
          } catch (err) {
            console.error("❌ Payment verification failed", err);
            alert("❌ Payment verification failed");
          }
        },

        prefill: {
          name: user.fullname,
          email: user.email,
        },
        theme: {
          color: "#0f5f42",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      alert("🎉 Booking confirmed as free trial (no payment needed).");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to book consultation");
  }
};



  const containerVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 120 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed pb-20 md:pb-0 inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-white border border-green-900 h-full w-full md:w-2/3 lg:w-1/2 overflow-y-auto" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#3b8c60] to-[#207158] rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#103e39]">Book a consultation</h1>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <motion.section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" variants={stepVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#3b8c60] to-[#207158] rounded-full flex items-center justify-center">
                   {consultant && (
                    <img src={consultant.profileImage || 'https://i.postimg.cc/bryMmCQB/profile-image.jpg'} className=' rounded-full' alt="" /> 
                   )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#103e39] mb-2">{consultant.fullName.toUpperCase()}</h3>
                    <p className="text-gray-600">{consultant.consultantRequest.consultantProfile.shortBio}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-[#103e39] mb-4">How long would you like to meet for?</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <input type="radio" name="duration" value="5" checked={selectedDuration === '5'} onChange={(e) => setSelectedDuration(e.target.value)} className="w-5 h-5 text-[#3b8c60] focus:ring-[#3b8c60]" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium text-[#103e39]">5 minutes</span>
                        <span className="text-[#3b8c60] font-semibold">FREE (One Time)</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <input type="radio" name="duration" value="30" checked={selectedDuration === '30'} onChange={(e) => setSelectedDuration(e.target.value)} className="w-5 h-5 text-[#3b8c60] focus:ring-[#3b8c60]" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium text-[#103e39]">30 minutes</span>
                        <span className="text-[#3b8c60] font-semibold">₹{consultant.consultantRequest.consultantProfile.sessionFee}</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-[#103e39] mb-4">Select Date</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableDates.map((dateObj) => (
                      <button
                        key={dateObj.date}
                        onClick={() => {
                          setSelectedDate(dateObj.date);
                          setSelectedTime('');
                        }}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedDate === dateObj.date ? 'bg-[#3b8c60] text-white border-[#3b8c60]' : 'border-gray-200 hover:border-[#3b8c60] hover:bg-[#3b8c60]/5'
                        }`}
                      >
                        <div className="text-sm font-medium">{dateObj.dayName}</div>
                        <div className="text-xs opacity-80">{dateObj.displayDate}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <motion.div className="mb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                    <h4 className="text-lg font-semibold text-[#103e39] mb-4 flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Select Time</span>
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {getAvailableTimesForDate().map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            selectedTime === time ? 'bg-[#3b8c60] text-white border-[#3b8c60]' : 'border-gray-200 hover:border-[#3b8c60] hover:bg-[#3b8c60]/5'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedDate && selectedTime && (
                  <motion.div className="mb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                    <h4 className="text-lg font-semibold text-[#103e39] mb-4">consultation Detail
                    </h4>
                    <textarea
                      value={consultationDetails}
                      onChange={(e) => setConsultationDetails(e.target.value)}
                      placeholder="Please describe your project or what you'd like to discuss during the consultation..."
                      className="w-full p-4 border border-gray-200 rounded-xl focus:border-[#3b8c60] focus:ring-2 focus:ring-[#3b8c60]/20 outline-none transition-all resize-none"
                      rows="4"
                    />
                  </motion.div>
                )}

                {selectedDate && selectedTime  && (
                  <motion.button
                    onClick={handleBookMeeting}
                    className="w-full md:w-[40%] bg-gradient-to-r from-[#3b8c60] to-[#207158] text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Book Meeting</span>
                  </motion.button>
                )}
              </motion.section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingPage;
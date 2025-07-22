import axios from "axios";

// Create an axios instance with baseURL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ✅ This sends cookies with every request
});




export const creatependingBooking = async (data) => {
  try {
    const response = await API.post("/booking/createbooking", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}





export const confirmBooking = async (data) => {
  try {
    const response = await API.post("/booking/confirmbooking", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}





 

export const getBookingsByConsultantId = async (consultantId) => {
  try {
    const response = await API.get(`/booking/getbookingsviaConsultantid/${consultantId}`);
    return response.data.data; // assuming you're using `new ApiResponse(code, data)`
  } catch (error) {
    throw error.response?.data || error;
  }
};







export const  createOrder  = async (data) => {
  try {
    const response = await API.post("/payment/create-order", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}




export const getBookingById = async (bookingId) => {
  try {
    const response = await API.get(`/booking/booking/${bookingId}`);
    console.log("Booking API Response:", response.data); 
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

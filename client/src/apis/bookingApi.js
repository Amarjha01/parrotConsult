import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});




export const createBooking = async (data) => {
  try {
    const response = await API.post("/booking/createbooking", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export const verifyPayment = async (data) => {
  try {
    const response = await API.post("/payment/verifypayment", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const confirmBooking = async (data) => {
  try {
    const response = await API.post("/booking/confirmbooking", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}


export const getBookingsByConsultantId = async () => {
  try {
    const response = await API.get(`/booking/getbookingsviaConsultantid`);
    return response.data.data; 
    
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




export const getBookingById = async () => {
  try {
    const response = await API.get(`/booking/getbooking`); 
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

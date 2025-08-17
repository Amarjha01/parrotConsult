
import axios from "axios";

// Create an axios instance with baseURL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, 
});





export const globalconsultantdetails = async () => {
    try {
      const response = await API.get("/global/globalseeallactiveconsultants");
      return response.data.data;
      
      
    } catch (error) {
      throw error.response?.data || error;
    }
  };
export const viewSingleConsultant = async (id) => {
    try {
      const response = await API.post("/global/viewSingleConsultant" , 
        {id});
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };



  export const sendContactUsMail = async(data) =>{
    try {
      const response = await API.post('/global/sendContactUsData' , data)
      return response
      
    } catch (error) {
      console.log(error);
      
    }
  } 

import axios from "axios";

// Create an axios instance with baseURL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ✅ This sends cookies with every request
});



export const registerUser = async (formdata) => {
    const response = await API.post("/user/registeruser", formdata, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log('response 123 ' , response);
    
    return response;
  };

  export const loginUser = async (formdata) => {
    console.log(formdata);
    
    const response = await API.post("/user/loginuser", formdata, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log('response 1' , response);
    
    return response
  };
  
  export const logoutUSer = async () => {
    try {
      const response = await API.post("/user/logoutuser");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };


  export const seeBooking = async () => {
    try {
      const response = await API.get("/user/seebookings");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

 export const profileUpdate = async (modifiedData) => {
  console.log('modifiedData' , modifiedData);
  
  const response = await API.post('/user/updateProfile', modifiedData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
    console.log('response' , response);

  return response.data;
  
};

export const getAadharVerify = async(DataToVerify)=>{
  try {
    const response = await API.post('/user/aadharVerify' , DataToVerify , {
      headers:{
        'Content-Type':'application/json'
      }
    })
    console.log('aadasj' ,response);
    return response;
    
  } catch (error) {
    
  }
}

export const submitConsultantApplication = async(data) =>{
  console.log('consultantApplication data ' , data);

  try {
    if (!data) {
      return 'please provide data';
    }
    const response = await API.post('/user/consultantApplication' , data ,{
      headers: {
     'Content-Type': 'multipart/form-data', 
      }
    })
    return response;
    
  } catch (error) {
    console.log(error);
    
  }
}
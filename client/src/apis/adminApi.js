import axios from "axios";

// Create an axios instance with baseURL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, 
});

export const registerAsAdmin = (formdata) => {
  return API.post("/admin/registeradminsecuredonly", formdata, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const loginAsAdmin = (formdata) => {
  return API.post("/admin/loginadminsecuredonly", formdata, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const logout = async () => {
  try {
    const response = await API.post("/admin/logoutadmin");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getallunapprovedconsultants = async () => {
  try {
    const response = await API.get("/admin/seeunapprovedconsultants");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const adminapproveconsultant = async (consultantId) => {
  try {
    const response = await API.post(
      `/admin/adminapproveconsultant/${consultantId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const adminrejectconsultant = async (consultantId) => {
  try {
    const response = await API.post(
      `/admin/adminrejectconsultant/${consultantId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const adminSeeAllBookings = async () => {
  try {
    const response = await API.get("/admin/getallbookingsAdmin");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

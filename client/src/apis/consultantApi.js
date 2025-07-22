import axios from "axios";

// Create an axios instance with baseURL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // withCredentials: true, // ✅ This sends cookies with every request
});

export const registerAsConsultant = (formdata) => {
  return API.post("/consultant/registerasconsultant", formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const loginAsConsultant = (formdata) =>
  API.post("/consultant/loginconsultant", formdata); // ✅ loginAsConsultant

export const updateConsultantProfile = (data, token) => {
  return API.put("/consultant/updateProfile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

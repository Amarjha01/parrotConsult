import React, { useState, useEffect } from "react";
import { updateConsultantProfile } from "../apis/consultantApi";
import { showSuccessToast, showErrorToast } from "../util/Notification";
import { Plus, Clock, AlertCircle } from "lucide-react";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const EditConsultantProfile = ({ consultantData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    experience: 0,
    primaryCategory: "",
    hourlyRate: 0,
    specializedServices: [],
    keySkills: [],
    languageProficiency: [],
    weeklyAvailability: {},
  });

  useEffect(() => {
    if (consultantData) {
      setFormData({
        ...consultantData.data,
        weeklyAvailability: consultantData.data.weeklyAvailability || {},
      });
    }
  }, [consultantData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (day, checked) => {
    setFormData((prev) => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        [day]: checked ? [{ start: "09:00", end: "17:00" }] : [],
      },
    }));
  };

  const handleTimeSlotChange = (day, index, field, value) => {
    const updatedSlots = [...(formData.weeklyAvailability[day] || [])];
    updatedSlots[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        [day]: updatedSlots,
      },
    }));
  };

  const addTimeSlot = (day) => {
    setFormData((prev) => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        [day]: [
          ...(prev.weeklyAvailability[day] || []),
          { start: "", end: "" },
        ],
      },
    }));
  };

  const removeTimeSlot = (day, index) => {
    const updatedSlots = formData.weeklyAvailability[day].filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        [day]: updatedSlots,
      },
    }));
  };


// const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form submission started");
  
//     try {
//       const consultant = JSON.parse(localStorage.getItem("consultant"));
//       const token = consultant?.data?.accessToken;
  
//       if (!token) {
//         showErrorToast("Access token missing. Please login again.");
//         return;
//       }
  
//       console.log("Token:", token);
//       console.log("Sending data:", formData);
  
//       const response = await updateConsultantProfile(formData, token);
//       console.log("API Response:", JSON.stringify(response, null, 2));
  
//       showSuccessToast("Profile updated successfully");
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       showErrorToast("Failed to update profile");
//     }
//   };


const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
  
    try {
      const consultant = JSON.parse(localStorage.getItem("consultant"));
      const token = consultant?.data?.accessToken;
  
      if (!token) {
        console.error("Access token missing. Please login again.");
        return;
      }
  
      console.log("Token:", token);
      console.log("Sending data:", formData);
  
      const response = await updateConsultantProfile(formData, token);
      console.log("API Response:", JSON.stringify(response, null, 2));
  
      // ✅ Update localStorage with latest consultant data
      const updatedConsultant = response?.data?.data;
      localStorage.setItem("consultant", JSON.stringify({
        data: { ...updatedConsultant, accessToken: token }
      }));
  
      console.log("Profile updated successfully");
  
      
      window.location.reload(); 
    } catch (error) {
      console.error("Error submitting form:", error);
      console.error("Failed to update profile");
    }
  };
  
  
  

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="input"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="input"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Primary Category"
          value={formData.primaryCategory}
          onChange={(e) => handleInputChange("primaryCategory", e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Experience"
          value={formData.experience}
          onChange={(e) => handleInputChange("experience", e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Hourly Rate"
          value={formData.hourlyRate}
          onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
          className="input"
        />
        <input
          type="text"
          value={(formData.keySkills || []).join(", ")}
          onChange={(e) =>
            handleInputChange(
              "keySkills",
              e.target.value.split(",").map((s) => s.trim())
            )
          }
        />

        <input
          type="text"
          value={(formData.specializedServices || []).join(", ")}
          onChange={(e) =>
            handleInputChange(
              "specializedServices",
              e.target.value.split(",").map((s) => s.trim())
            )
          }
        />

        <input
          type="text"
          value={(formData.languageProficiency || []).join(", ")}
          onChange={(e) =>
            handleInputChange(
              "languageProficiency",
              e.target.value.split(",").map((s) => s.trim())
            )
          }
        />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Weekly Availability</h3>
        {days.map((day) => (
          <div key={day} className="mb-4">
            <label className="flex gap-2 items-center mb-2">
              <input
                type="checkbox"
                checked={(formData.weeklyAvailability[day] || []).length > 0}
                onChange={(e) => handleCheckbox(day, e.target.checked)}
              />
              <span className="capitalize font-medium">{day}</span>
            </label>

            {(formData.weeklyAvailability[day] || []).map((slot, idx) => (
              <div key={idx} className="flex gap-4 items-center mb-2">
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) =>
                    handleTimeSlotChange(day, idx, "start", e.target.value)
                  }
                  className="input"
                />
                <span>to</span>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) =>
                    handleTimeSlotChange(day, idx, "end", e.target.value)
                  }
                  className="input"
                />
                <button
                  type="button"
                  className="text-red-600 text-sm"
                  onClick={() => removeTimeSlot(day, idx)}
                >
                  Remove
                </button>
              </div>
            ))}

            {(formData.weeklyAvailability[day] || []).length > 0 && (
              <button
                type="button"
                onClick={() => addTimeSlot(day)}
                className="text-emerald-600 text-sm flex items-center gap-1"
              >
                <Plus size={14} /> Add slot
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditConsultantProfile;

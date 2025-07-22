import React, { useState, useEffect } from "react";


// Import your API service
import { globalconsultantdetails } from "../../apis/globalApi";
import MeetExperts from "./meetTheExperts";
import ConsultantDetailView from "./consultantDetailView";

// Main component that handles both list and detail views
export default function ConsultantManager() {
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consultants data on component mount
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const response = await globalconsultantdetails();
        setConsultants(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch consultants");
        console.error("Error fetching consultants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  // Handle view profile click
  const handleViewProfile = (consultant) => {
    setSelectedConsultant(consultant);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedConsultant(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-900"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show consultants list
  return (
    <MeetExperts consultants={consultants}  />
  );
}



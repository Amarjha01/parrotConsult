import React, { useEffect, useState } from "react";

import { getSmartConsultantSuggestion } from "../apis/openaiApi";
import ConsultantRecommendationCard from "./Recomendationcard";

const QuizResult = ({ answers }) => {
  const [consultant, setConsultant] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConsultant = async () => {
      try {
        const res = await getSmartConsultantSuggestion(answers);
        console.log("🎯 Got response from backend:", res);
  
        const { recommended, message } = res.status; // ✅ CORRECTED HERE
        setConsultant(recommended);
        setMessage(message);
      } catch (err) {
        console.error("❌ Error in QuizResult:", err);
        setError("Something went wrong while fetching consultant suggestion.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchConsultant();
  }, [answers]);
  

  if (loading) return <p className="text-center">⏳ Finding your perfect match...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="pt-10">
      <ConsultantRecommendationCard
        consultant={consultant}
        message={message}
        onBook={() => alert("Booking flow goes here")}
      />
    </div>
  );
};

export default QuizResult;

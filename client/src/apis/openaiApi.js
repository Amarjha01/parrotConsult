import axios from "axios";

// Create an axios instance with baseURL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const getOpenAIResponse = async (prompt) => {
  const response = await API.post("/openai/generate", { prompt });
  return response.data.reply;
};

export const getSmartConsultantSuggestion = async ({ helpTopic, stage, budget }) => {
  try {
    console.log("📤 Sending payload:", { helpTopic, stage, budget });

    const response = await API.post("/assistant/suggest", {
      helpTopic,
      stage,
      budget,
    });

    console.log("✅ Full API Response:", response.data);

    return response.data; // { recommended, message, options }
  } catch (error) {
    console.error("❌ AI Suggestion Error:", error.response?.data || error.message);
    throw error;
  }
};

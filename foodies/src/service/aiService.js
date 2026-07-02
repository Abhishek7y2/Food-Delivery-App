import axios from "axios";

const API_URL = "http://localhost:8080/api/ai";

export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};
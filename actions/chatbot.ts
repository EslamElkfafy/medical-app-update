import axios from "axios";
import { apiUrl } from "@/config/constants";

class ChatBotService {
  static async sendMessage(question: string) {
    try {
      const response = await axios.post(`${apiUrl}/chat-bot`, { question });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message.");
    }
  }
}

export default ChatBotService;

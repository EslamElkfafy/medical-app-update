"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ChatBotService from "@/actions/chatbot";
import TypingIndicator from "../TypingIndicator";

const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState<
    { type: string; text: string }[]
  >([{ type: "bot", text: "Welcome! How can I help you?" }]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = message;
    setChatHistory((prev) => [...prev, { type: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const data = await ChatBotService.sendMessage(userMessage);
      setChatHistory((prev) => [...prev, { type: "bot", text: data.answer }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", text: "Error sending message." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <motion.div
        className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full cursor-pointer shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle size={24} strokeWidth={2} className="text-white" />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatContainer"
            className="bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden flex flex-col mt-2"
            initial={{ width: 50 }}
            animate={{ width: 350 }}
            exit={{
              width: 50,
              y: -10,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              key="chatContent"
              className="flex flex-col"
              initial={{ height: 50, opacity: 0 }}
              animate={{
                height: 400,
                opacity: 1,
                transition: { delay: 0.3, duration: 0.3, ease: "easeOut" },
              }}
              exit={{
                height: 50,
                opacity: 0,
                y: -20,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
                <span>Chat with AI</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white text-lg"
                >
                  ✖
                </button>
              </div>

              <div className="p-3 flex-grow overflow-auto space-y-2">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg w-fit max-w-[80%] break-words ${
                        msg.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="p-2 rounded-lg w-fit max-w-[80%] bg-gray-200 dark:bg-gray-700 text-black dark:text-white flex items-center">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t dark:border-gray-700 flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  {loading ? "..." : "Send"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;

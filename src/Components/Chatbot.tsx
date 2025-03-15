import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bell, Github } from "lucide-react";

export default function BobGPT() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [notifications, setNotifications] = useState<string[]>(["Welcome to Bob-GPT! Stay tuned for updates."]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:8000/api/chat/", { message: input });
      const botMessage = { sender: "Bob-GPT 1.0", text: response.data.bot };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-indigo-200 to-pink-300 p-6 md:p-12 relative">
      {/* Notifications Bar */}
      <div className="absolute top-0 left-0 w-full bg-indigo-600 text-white text-center py-2 text-sm font-medium flex items-center justify-center gap-2">
        <Bell size={18} /> {notifications[notifications.length - 1]}
      </div>
      
      {/* Header */}
      <div className="bg-white shadow-xl p-5 text-center text-3xl md:text-4xl font-extrabold text-gray-800 rounded-xl mb-6 border-b-4 border-indigo-600 mt-10">
        Bob-GPT 1.0 - Your AI Assistant
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 rounded-xl bg-white shadow-2xl border border-gray-400 backdrop-blur-lg max-w-3xl mx-auto w-full">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-lg p-3 md:p-4 rounded-3xl text-base md:text-lg font-medium ${
              msg.sender === "user"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white self-end ml-auto shadow-xl"
                : "bg-gray-200 text-gray-900 shadow-md"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-3 md:gap-4 bg-white p-4 md:p-5 rounded-xl shadow-xl border border-gray-400 mt-6 max-w-3xl mx-auto w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 p-3 md:p-4 border-2 border-gray-400 rounded-full outline-none focus:ring-4 focus:ring-indigo-500 text-base md:text-lg shadow-sm"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white p-3 md:p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
        >
          <Send size={24} md:size={28} />
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <a
          href="https://github.com/bmuia/bobGPT-ui.git"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
        >
          <Github size={20} /> View Source Code
        </a>
      </div>
    </div>
  );
}

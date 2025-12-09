"use client";
import { useChatbotContext } from "@/context/ChatbotContext";
import React from "react";
import { TbSend } from "react-icons/tb";

type ChatbotFooterProps = {
  onSend: (message: string) => void;
};

const ChatbotFooter: React.FC<ChatbotFooterProps> = ({ onSend }) => {
  const { input, setInput } = useChatbotContext();

  const handleSend = () => {
    if (!input?.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="p-2 border-t border-t-gray-300 bg-white">
      <form className="relative w-full" onSubmit={handleFormSubmit}>
        {/* Input */}
        <input
          type="text"
          required
          value={input || ""}
          onChange={(e) => setInput(e.target.value)}
          // onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="w-full px-4 py-1.5 rounded-full border border-gray-300
          focus:outline-none focus:ring focus:ring-blue-400 transition-all"
        />

        {/* Send Icon — inside input */}
        <button
          // onClick={handleSend}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 
          p-2 rounded-full bg-linear-to-r from-blue-600 to-purple-600
          hover:opacity-90 transition-all shadow-md cursor-pointer"
        >
          <TbSend color={`#fff`} size={18} />
        </button>
      </form>
      <p className="text-[10px] text-center mt-2 text-gray-400">Product by: Kyra IT Solutions</p>
    </div>
  );
};

export default ChatbotFooter;

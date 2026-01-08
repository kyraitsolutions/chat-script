"use client";
import { useChatbotContext } from "@/context/ChatbotContext";
import { TChatbotTheme } from "@/types/chat-bot.type";
import React from "react";
import { TbSend } from "react-icons/tb";

type ChatbotFooterProps = {
  theme: TChatbotTheme | null;
  onSend: (message: string) => void;
};

const ChatbotFooter: React.FC<ChatbotFooterProps> = ({ theme, onSend }) => {
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
      <form
        className="flex items-center gap-5 w-full"
        onSubmit={handleFormSubmit}
      >
        {/* Input */}
        <input
          type="text"
          required
          value={input || ""}
          onChange={(e) => setInput(e.target.value)}
          // onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="w-full px-4 py-2.5 outline-none"
        />

        {/* Send Icon — inside input */}
        <button
          // onClick={handleSend}
          style={{
            backgroundColor: theme?.backgroundColor || "#fefefe",
          }}
          className="
          p-2 rounded-full bg-gray-500
          hover:opacity-90 transition-all shadow-md cursor-pointer"
        >
          <TbSend color={`#fff`} size={18} />
        </button>
      </form>
      <p className="text-[10px] text-center mt-2 text-gray-400">
        Product by: Kyra IT Solutions
      </p>
    </div>
  );
};

export default ChatbotFooter;

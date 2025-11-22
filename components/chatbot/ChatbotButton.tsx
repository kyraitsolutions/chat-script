import Image from "next/image";
import React from "react";

type ChatbotButtonProps = {
  onClose: () => void;
};

const ChatbotButton = ({ onClose }: ChatbotButtonProps) => {
  const chatbotImage = "/images/ChatbotImage.jpg";
  return (
    <button
      onClick={onClose}
      className={`size-20 rounded-full flex justify-center items-center cursor-pointer shadow-xl p-0.5 transition-all duration-300 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600
    hover:scale-105 hover:shadow-2xl relative
  `}
    >
      {/* Glow Ring */}
      {/* <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 blur-lg opacity-40" /> */}

      {/* Inner Circle */}
      <div
        className="
      relative w-full h-full rounded-full overflow-hidden 
      border border-white/20 backdrop-blur-sm"
      >
        <Image
          src={chatbotImage}
          alt="Chatbot"
          fill
          className="object-cover rounded-full"
        />
      </div>
    </button>
  );
};

export default ChatbotButton;

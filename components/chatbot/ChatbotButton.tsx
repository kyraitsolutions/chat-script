import Image from "next/image";
import React from "react";

type ChatbotButtonProps = {
  backgroundColor?: string;
  onClose: () => void;
};

const ChatbotButton = ({ onClose, backgroundColor }: ChatbotButtonProps) => {
  const chatbotImage = "/images/ChatbotImage.jpg";
  return (
    <button
      style={{
        backgroundColor: backgroundColor || "#fefef",
      }}
      onClick={onClose}
      className={`size-14 rounded-full flex justify-center items-center cursor-pointer shadow-sm p-0.5 transition-all duration-300
      hover:scale-105 relative`}
    >
      {/* Glow Ring */}
      {/* <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 blur-lg opacity-40" /> */}

      {/* Inner Circle */}
      <div
        className="
      relative w-full h-full rounded-full overflow-hidden"
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

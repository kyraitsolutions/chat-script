import React from "react";
import { RxCross2 } from "react-icons/rx";

type ChatbotButtonProps = {
  name: string;
  onClose: () => void;
};

const ChatbotHeader = ({ name, onClose }: ChatbotButtonProps) => {
  return (
    <div
      className={`bg-gray-500 rounded-t-sm px-5 py-2 flex justify-between items-center`}
    >
      <div>
        <h2 className="text-white font-medium text-sm capitalize">{name}</h2>
      </div>

      <div>
        <span
          onClick={onClose}
          className="cursor-pointer hover:rotate-90 transition-all duration-300 inline-block"
        >
          <RxCross2 color={`#fff`} size={18} />
        </span>
      </div>
    </div>
  );
};

export default ChatbotHeader;

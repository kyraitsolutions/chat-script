import React from "react";
import { RxCross2 } from "react-icons/rx";

type ChatbotButtonProps = {
  name: string;
  onClose: () => void;
};

const ChatbotHeader = ({ name, onClose }: ChatbotButtonProps) => {
  return (
    <div
      className={`bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-t-sm p-4 flex justify-between items-center`}
    >
      <div>
        <h2 className="text-white font-medium text-sm">{name}</h2>
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

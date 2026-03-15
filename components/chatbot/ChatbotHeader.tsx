import { useChatbotContext } from "@/context/ChatbotContext";
import { TChatbotTheme } from "@/types/chat-bot.type";
import { MdArrowBack } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

type ChatbotButtonProps = {
  name: string;
  onClose: () => void;
  theme: TChatbotTheme | null;
};

const ChatbotHeader = ({ name, theme, onClose }: ChatbotButtonProps) => {
  const { setView } = useChatbotContext();
  return (
    <div
      style={{
        backgroundColor: theme?.backgroundColor || "#1b181b",
      }}
      className={`bg-gray-500 md:rounded-t-sm px-5 py-3 flex justify-between items-center`}
    >

      <div className="flex items-center">
        <button onClick={() => setView("chats")}><MdArrowBack /> </button>

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

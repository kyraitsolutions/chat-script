import { useChatbotContext } from "@/context/ChatbotContext";
import { TChatbotTheme } from "@/types/chat-bot.type";
import { ArrowLeft, X } from "lucide-react";
import { RxCross2 } from "react-icons/rx";

type ChatbotButtonProps = {
  name: string;
  onClose: () => void;
  theme: TChatbotTheme | null;
};

const ChatbotHeader = ({ name, theme, onClose }: ChatbotButtonProps) => {
  const { view, setView } = useChatbotContext();
  const handleBack = () => {
    setView(view === "messages area" ? "chats" : "home");
  };
  return (
    <div
      style={{
        backgroundColor: theme?.backgroundColor || "#1b181b",
        color: theme?.userMessageColor || "#fff",
      }}
      className={`bg-gray-500 md:rounded-t-sm p-3 flex justify-between items-center`}
    >
      <div className="flex items-center gap-2">
        {view !== "home" && (
          <span
            onClick={handleBack}
            className="bg-black/10 size-6 rounded-full flex justify-center items-center hover:bg-black/15 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </span>
        )}

        <h2 className="font-medium text-sm capitalize">{name}</h2>
      </div>

      <div>
        <span
          onClick={onClose}
          className="cursor-pointer hover:rotate-90 transition-all duration-300 inline-block"
        >
          <X size={16} />
        </span>
      </div>
    </div>
  );
};

export default ChatbotHeader;

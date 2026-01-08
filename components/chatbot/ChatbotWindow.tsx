"use clinet";
import { ChatbotProvider } from "@/context/ChatbotContext";
import { useRef } from "react";
import ChatbotFooter from "./ChatbotFooter";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMain from "./ChatbotMain";
import { TChatBotData } from "@/types/chat-bot.type";

type ChatbotWindowProps = {
  onClose: () => void;
  chatbotData: TChatBotData | null;
  accountId: string;
  chatbotId: string;
};

const ChatbotWindow = ({
  onClose,
  chatbotData,
  accountId,
  chatbotId,
}: ChatbotWindowProps) => {
  const submitRef = useRef<((msg: string) => void) | null>(null);

  const handleSend = (message: string) => {
    submitRef.current?.(message); // Call Main's submit with message
  };
  return (
    <ChatbotProvider>
      <main className="sm:rounded-[20px] overflow-hidden shadow-lg h-screen sm:h-[614px] w-screen sm:w-[400px] min-w-76 flex flex-col sm:mb-2">
        <ChatbotHeader
          theme={chatbotData?.theme || null}
          name={chatbotData?.name || "Chatbot"}
          onClose={onClose}
        />
        <ChatbotMain
          theme={chatbotData?.theme || null}
          submitRef={submitRef}
          nodes={chatbotData?.flow?.nodes || []}
          edges={chatbotData?.flow?.edges || []}
          accountId={accountId}
          chatbotId={chatbotId}
        />
        <ChatbotFooter onSend={handleSend} theme={chatbotData?.theme || null} />
      </main>
    </ChatbotProvider>
  );
};

export default ChatbotWindow;

"use clinet";
import { ChatbotProvider } from "@/context/ChatbotContext";
import { useRef } from "react";
import ChatbotFooter from "./ChatbotFooter";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMain from "./ChatbotMain";
import { TChatbotData, TChatEdge, TChatNode } from "./ChatbotWidget";

type ChatbotWindowProps = {
  onClose: () => void;
  chatbotData: TChatbotData | null;
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
      <main className="border border-gray-200 rounded-sm shadow-lg h-[460px] min-w-76 flex flex-col">
        <ChatbotHeader onClose={onClose} />
        <ChatbotMain
          submitRef={submitRef}
          nodes={chatbotData?.flow?.nodes || []}
          edges={chatbotData?.flow?.edges || []}
          accountId={accountId}
          chatbotId={chatbotId}
        />
        <ChatbotFooter onSend={handleSend} />
      </main>
    </ChatbotProvider>
  );
};

export default ChatbotWindow;

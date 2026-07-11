import { TChatBotData } from "@/types/chat-bot.type";
import { createContext, useContext, useState } from "react";

export type View = "home" | "chats" | "messages area" | null;

export type TInputType =
  | "text"
  | "email"
  | "phone"
  | "date"
  | "date-range"
  | "textarea";

export type TInputConfig = {
  type: TInputType;
  placeholder?: string;
} | null;

interface ChatbotContextType {
  input: string | null;
  setInput: (input: string) => void;
  view: View;
  setView: (view: View) => void;
  activeSessionId: string | null;
  setActiveSessionId: (sessionId: string) => void;
  conversationId: string | null;
  setConversationId: (conversationId: string) => void;
  chatbotData: TChatBotData | null;
  setChatbotData: React.Dispatch<React.SetStateAction<TChatBotData | null>>;
  inputConfig: TInputConfig;
  setInputConfig: React.Dispatch<React.SetStateAction<TInputConfig>>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [chatbotData, setChatbotData] = useState<TChatBotData | null>(null);
  const [input, setInput] = useState<string | null>(null);
  const [view, setView] = useState<View>("home");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [inputConfig, setInputConfig] = useState<TInputConfig>({
    type: "text",
    placeholder: "Type a message...",
  });
  return (
    <ChatbotContext.Provider
      value={{
        input,
        setInput,
        view,
        setView,
        activeSessionId,
        setActiveSessionId,
        conversationId,
        setConversationId,
        chatbotData,
        setChatbotData,
        inputConfig,
        setInputConfig,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbotContext must be used within a ChatbotProvider");
  }
  return context;
};

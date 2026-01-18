import { createContext, useContext, useState } from "react";

export type View = "home" | "chats" | "messages area" | null;

interface ChatbotContextType {
  input: string | null;
  setInput: (input: string) => void;
  view: View;
  setView: (view: View) => void;
  activeSessionId: string | null;
  setActiveSessionId: (sessionId: string) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [input, setInput] = useState<string | null>(null);
  const [view, setView] = useState<View>("home");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  return (
    <ChatbotContext.Provider
      value={{
        input,
        setInput,
        view,
        setView,
        activeSessionId,
        setActiveSessionId,
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

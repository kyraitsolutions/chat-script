import { createContext, useContext, useState } from "react";

interface ChatbotContextType {
  input: string | null;
  setInput: (input: string) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [input, setInput] = useState<string | null>(null);
  return (
    <ChatbotContext.Provider value={{ input, setInput }}>
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

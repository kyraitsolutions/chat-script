"use client";
import ChatbotWidget from "./ChatbotWidget";
import { ChatbotProvider } from "@/context/ChatbotContext";

const ChatbotApp = () => {
  return (
    <ChatbotProvider>
      <ChatbotWidget />
    </ChatbotProvider>
  );
};

export default ChatbotApp;

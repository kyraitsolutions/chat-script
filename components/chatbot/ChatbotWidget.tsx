"use client";
import React, { useEffect, useState } from "react";
import ChatbotWindow from "./ChatbotWindow";
import ChatbotButton from "./ChatbotButton";

type TFlowElement = {
  id: string;
  type: "text" | "option";
  content: string;
  title?: string;
  choices?: string[];
};
export type TChatNode = {
  id: string;
  // type?: "chat";
  data: { label: string; value: "text" | "option"; elements: TFlowElement[] };
};

export type TChatEdge = {
  id: string;
  source: string;
  sourceHandle?: string;
  target: string;
};

export type TChatbotData = {
  flow: {
    nodes: TChatNode[];
    edges: TChatEdge[];
  };
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatNodes, setChatNodes] = useState<TChatNode[] | []>([]);
  const [chatEdges, setChatEdges] = useState<TChatEdge[] | []>([]);
  const [chatbotConfig, setChatbotConfig] = useState({
    // accountId: "6911bffab35d190351b5ae54",
    // chatbotId: "6914b438b2c1e1a040c8e99d",

    accountId: "691f4404de2a4ef7d3831317",
    chatbotId: "691f46e143c7f114636e14cf",
  });

  const [chatbotData, setChatbotData] = useState<TChatbotData | null>({
    flow: {
      nodes: [],
      edges: [],
    },
  });

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const getChatbotData = async () => {
    try {
      console.log("yes");
      const response = await fetch(
        `http://localhost:3000/api/account/${chatbotConfig?.accountId}/chatbot/${chatbotConfig?.chatbotId}/get`
      );
      const data = await response.json();
      setChatbotData(data?.result?.docs);
    } catch (error) {
      console.error("Error fetching chatbot data:", error);
    }
  };

  useEffect(() => {
    getChatbotData();
  }, []);

  return (
    <div className="sm:fixed bottom-10 right-10">
      {isOpen && (
        <ChatbotWindow
          onClose={toggleChatbot}
          chatbotData={chatbotData}
          accountId={chatbotConfig.accountId}
          chatbotId={chatbotConfig.chatbotId}
        />
      )}
      {!isOpen && <ChatbotButton onClose={toggleChatbot} />}
    </div>
  );
};

export default ChatbotWidget;

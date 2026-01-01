"use client";
import React, { useEffect, useState } from "react";
import ChatbotWindow from "./ChatbotWindow";
import ChatbotButton from "./ChatbotButton";
import { MdClose } from "react-icons/md";

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

    accountId: "6955346367b2c98b79eedfe5",
    chatbotId: "69565e95eeca06247d0aaa12",
    // accountId: "6955346367b2c98b79eedfe5",
    // chatbotId: "69566f7f531062c97f4ad8a0",
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
    <div className="sm:fixed bottom-3 right-3">
      {isOpen && (
        <ChatbotWindow
          onClose={toggleChatbot}
          chatbotData={chatbotData}
          accountId={chatbotConfig.accountId}
          chatbotId={chatbotConfig.chatbotId}
        />
      )}
      {!isOpen && <ChatbotButton onClose={toggleChatbot} />}
      {isOpen && <div className="flex justify-end">
        <button onClick={toggleChatbot} className="size-14 hidden sm:flex rounded-full justify-center items-center cursor-pointer shadow-xl p-0.5 transition-all duration-300 bg-gray-500
    hover:scale-105 hover:shadow-2xl relative">
          <MdClose size={26} color="white" />
        </button> </div>}
    </div>
  );
};

export default ChatbotWidget;

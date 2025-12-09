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
    // abhijeet
    accountId: "6936851e7cf896ac7b646508",
    chatbotId: "69369c9337b41850d0e05e75",
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
        <button onClick={toggleChatbot} className="size-14 rounded-full flex justify-center items-center cursor-pointer shadow-xl p-0.5 transition-all duration-300 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600
    hover:scale-105 hover:shadow-2xl relative">
          <MdClose size={26} color="white" />
        </button> </div>}
    </div>
  );
};

export default ChatbotWidget;

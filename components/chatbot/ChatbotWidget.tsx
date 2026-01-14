"use client";
import React, { useEffect, useState } from "react";
import ChatbotWindow from "./ChatbotWindow";
import ChatbotButton from "./ChatbotButton";
import { MdClose } from "react-icons/md";
import {
  TChatBotData,
  // TChatbotEdge,
  // TChatbotNode,
} from "@/types/chat-bot.type";
import { BASE_URL_API } from "@/constant/constant";

// type TFlowElement = {
//   id: string;
//   type: "text" | "option";
//   content: string;
//   title?: string;
//   choices?: string[];
// };
// export type TChatNode = {
//   id: string;
//   // type?: "chat";
//   data: { label: string; value: "text" | "option"; elements: TFlowElement[] };
// };

// export type TChatEdge = {
//   id: string;
//   source: string;
//   sourceHandle?: string;
//   target: string;
// };

// export type TChatbotData = {
//   name: string;
//   flow: {
//     nodes: TChatNode[];
//     edges: TChatEdge[];
//   };
// };

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [chatNodes, setChatNodes] = useState<TChatbotNode[] | []>([]);
  // const [chatEdges, setChatEdges] = useState<TChatbotEdge[] | []>([]);
  const [chatbotConfig, setChatbotConfig] = useState({
    // accountId: "6952aa3e6afef960c93d0ede",
    // chatbotId: "695a934c848aa4d7bfd3ff43",
    accountId: "",
    chatbotId: ""
  });

  const [chatbotData, setChatbotData] = useState<TChatBotData | null>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const getChatbotData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL_API}/api/account/${chatbotConfig?.accountId}/chatbot/${chatbotConfig?.chatbotId}/get`
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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "CHATBOT_INIT") {
        setChatbotConfig(event.data.payload);
      }
    };
    window.parent.postMessage(
      {
        type: "CHATBOT_READY",
        payload: {
          active: chatbotData?.status,
          chatbotOpen: isOpen,
          position: chatbotData?.theme?.widgetPosition,
        },
      },
      "*"
    );
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isOpen, chatbotData?.status]);

  return (
    <div className="sm:fixed bottom-3 right-3 ">
      {isOpen && (
        <ChatbotWindow
          onClose={toggleChatbot}
          chatbotData={chatbotData}
          accountId={chatbotConfig.accountId}
          chatbotId={chatbotConfig.chatbotId}
        />
      )}

      {!isOpen && (
        <ChatbotButton
          onClose={toggleChatbot}
          backgroundColor={chatbotData?.theme?.borderColor}
        />
      )}

      {isOpen && (
        <div className="sm:flex hidden justify-end">
          <button
            style={{
              backgroundColor: chatbotData?.theme?.backgroundColor || "#fefefe",
            }}
            onClick={toggleChatbot}
            className="size-14 flex rounded-full justify-center items-center cursor-pointer shadow-xl p-0.5 transition-all duration-300 bg-gray-500
    hover:scale-105 hover:shadow-2xl relative"
          >
            <MdClose size={26} color="white" />
          </button>{" "}
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;

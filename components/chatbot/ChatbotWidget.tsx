"use client";
import { BASE_URL_API } from "@/constant/constant";
import { TChatBotData } from "@/types/chat-bot.type";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import ChatbotButton from "./ChatbotButton";
import ChatbotWindow from "./ChatbotWindow";

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
    accountId: "696a5d5a3a6180d00efb0e19",
    chatbotId: "696a5d903a6180d00efb0e56",
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

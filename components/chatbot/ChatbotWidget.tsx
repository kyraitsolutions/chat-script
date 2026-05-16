"use client";
import { BASE_URL_API, COOKIES_STORAGE_KEY } from "@/constant/constant";
import { TChatBotData } from "@/types/chat-bot.type";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import ChatbotButton from "./ChatbotButton";
import ChatbotWindow from "./ChatbotWindow";
import { useChatbotContext } from "@/context/ChatbotContext";
import { useChatbotWebSocket } from "@/hooks/useChatbotWebSocket";
import { CookieUtils } from "@/utils/cookie-storage.utils";

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
  const { setChatbotData, chatbotData } = useChatbotContext();
  // const [chatNodes, setChatNodes] = useState<TChatbotNode[] | []>([]);
  // const [chatEdges, setChatEdges] = useState<TChatbotEdge[] | []>([]);
  const [chatbotConfig, setChatbotConfig] = useState({
    accountId: "69da6f0dc9a4b079de116cb7",
    chatbotId: "69e24a79513820a741d3d583",

    // accountId: "69da02ae43110bf379b35cf8",
    // chatbotId: "69f1af40fae89cf130ba6c95",
  });

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const getChatbotData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL_API}/api/chatbot/${chatbotConfig?.accountId}/${chatbotConfig?.chatbotId}/flow`,
      );
      const data = await response.json();
      setChatbotData(() => data?.result?.doc);
    } catch (error) {
      console.error("Error fetching chatbot data:", error);
    }
  };

  const { isConnected } = useChatbotWebSocket({
    visitorId: CookieUtils.getItem(COOKIES_STORAGE_KEY.VISITOR_ID) || "",
    accountId: chatbotConfig?.accountId,
    chatbotId: chatbotConfig?.chatbotId,
  });

  useEffect(() => {
    // ✅ receive messages from the parent
    const handleMessage = (event: MessageEvent) => {
      // ✅ ignore all garbage messages
      if (!event.data || typeof event.data !== "object") return;

      // ✅ only process your type
      if (event.data.type !== "CHATBOT_INIT") return;
      // setChatbotConfig(event.data.payload);
    };
    window.addEventListener("message", handleMessage);

    // ✅ send the message to the parent
    window.parent.postMessage(
      {
        type: "CHATBOT_INIT",
        // payload: {
        //   active: chatbotData?.status,
        //   chatbotOpen: isOpen,
        //   position: chatbotData?.theme?.widgetPosition,
        // },
      },
      "*",
    );

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!chatbotConfig?.accountId && !chatbotConfig?.chatbotId) return;
    getChatbotData();
  }, [chatbotConfig]);

  useEffect(() => {
    if (chatbotData) {
      window.parent.postMessage(
        {
          type: "CHATBOT_READY",
          payload: {
            active: chatbotData?.status,
            chatbotOpen: isOpen,
            position: chatbotData?.theme?.widgetPosition,
          },
        },
        "*",
      );
    }
  }, [chatbotData, isOpen]);

  return (
    <div className="sm:fixed bottom-3 right-3 ">
      {isOpen && (
        <ChatbotWindow
          onClose={toggleChatbot}
          chatbotData={chatbotData}
          accountId={chatbotConfig?.accountId}
          chatbotId={chatbotConfig?.chatbotId}
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
            className="size-14 flex rounded-full justify-center items-center cursor-pointer shadow-xl p-0.5 transition-all duration-300 bg-gray-500 hover:scale-105 hover:shadow-2xl relative"
          >
            <MdClose size={26} color="white" />
          </button>{" "}
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;

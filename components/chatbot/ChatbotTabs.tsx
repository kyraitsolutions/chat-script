"use client";

import { useChatbotContext, View } from "@/context/ChatbotContext";
import { HiChatAlt2, HiHome } from "react-icons/hi";

interface Tab {
  label: string;
  value: View;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    label: "Home",
    value: "home",
    icon: <HiHome size={18} />,
  },

  {
    label: "Chat",
    value: "chats",
    icon: <HiChatAlt2 size={18} />,
  },
];

const ChatbotTabs = () => {
  const { setView, chatbotData } = useChatbotContext();
  const handleTabChange = (tab: View) => {
    setView(tab);
  };

  const tabClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-medium transition-colors ${
      active ? "text-green-600" : "text-gray-400"
    }`;

  return (
    <div>
      <div className="flex items-center justify-evenly bg-gray-100 rounded-2xl p-2">
        {tabs?.map((tab) => (
          <button
            key={tab?.value}
            className="flex flex-col items-center justify-center cursor-pointer rounded-full"
            onClick={() => handleTabChange(tab?.value)}
          >
            <div
              style={{
                color: chatbotData?.theme?.backgroundColor || "#000000",
              }}
            >
              {tab?.icon && tab?.icon}
            </div>
            <span className="text-sm text-gray-500">{tab?.label}</span>
          </button>
        ))}
        {/* HOME TAB */}
      </div>
    </div>
  );
};

export default ChatbotTabs;

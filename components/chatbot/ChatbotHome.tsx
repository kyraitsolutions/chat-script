"use client";

import { useChatbotContext } from "@/context/ChatbotContext";

const ChatHome = () => {
  const { setView } = useChatbotContext();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Hi there 👋</h2>

      <p className="text-sm text-gray-600">
        Explore Docs, News or Chat with us
      </p>

      <button
        onClick={() => setView("chats")}
        className="w-full bg-green-500 text-white py-3 rounded-md font-medium"
      >
        Ask a question
      </button>
    </div>
  );
};

export default ChatHome;

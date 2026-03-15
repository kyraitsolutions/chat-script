"use client";

import { CHATBOT_DB } from "@/constant/constant";
import { useChatbotContext } from "@/context/ChatbotContext";
import { createSession, getAllSessionsByChatbot } from "@/utils/chatbotIndexDb";
import { setSessionId } from "@/utils/chatbotSessions";
import { formatRelativeTime } from "@/utils/dateTime";
import { useEffect, useState } from "react";
import { set } from "zod";

type ChatbotMessageListsProps = {
  chatbotId: string;
};

type MessageItem = {
  id: string;
  sessionId: string;
  title: string | undefined;
  subtitle: string;
  time: string;
};

const ChatMessagesLists = ({ chatbotId }: ChatbotMessageListsProps) => {
  const { setView, setActiveSessionId } = useChatbotContext();
  const [messages, setMessages] = useState<MessageItem[] | []>([]);
  const handleMessageClick = (messageData: any) => {
    setView("messages area");
    setActiveSessionId(messageData.sessionId);
  };

  const handleClickAskQuestions = async () => {
    const newSessionId = crypto.randomUUID();
    setView("messages area");
    await createSession({
      sessionId: newSessionId,
      chatbotId,
      messages: [],
      currentNodeId: null,
      leadId: null,
      updatedAt: Date.now(),
    });

    setActiveSessionId(newSessionId);
  };

  const getAllChatbotSessions = async () => {
    const sessions = await getAllSessionsByChatbot(chatbotId);

    const chats = sessions
      // 1️⃣ only real conversations
      .filter((s) => s.messages && s.messages.length > 2)
      // 2️⃣ newest first
      .sort((a, b) => b.updatedAt - a.updatedAt)
      // 3️⃣ map to UI model
      .map((session) => {
        const lastMsg = session.messages?.at(-1);

        return {
          id: session?.sessionId, // ✅ required by MessageItem
          sessionId: session.sessionId,
          title: lastMsg?.text,
          subtitle: lastMsg?.from === "user" ? "You" : "Bot",
          time: formatRelativeTime(session.updatedAt),
        };
      });

    if (chats.length > 0) {
      setMessages(chats);
    }
  };

  useEffect(() => {
    getAllChatbotSessions();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden shadow-lg relative">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="flex items-center justify-center py-4">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700">
            Messages
          </h2>
        </div>
      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleMessageClick(msg)}
              className="
            group flex items-center gap-3 px-4 py-3
            border-b border-gray-100 last:border-b-0
            cursor-pointer
            transition
            hover:bg-gray-50
            active:bg-gray-100
          "
            >
              {/* AVATAR */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600">
                  {msg.title?.charAt(0)?.toUpperCase()}
                </div>

                {/* UNREAD DOT */}
                {msg.unread && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {msg.title}
                </p>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="truncate">{msg.subtitle}</span>
                  <span>·</span>
                  <span className="whitespace-nowrap">{msg.time}</span>
                </div>
              </div>

              {/* RIGHT ARROW / HOVER INDICATOR */}
              <div className="opacity-0 group-hover:opacity-100 transition text-gray-300">
                →
              </div>
            </div>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              💬
            </div>
            <p className="text-sm font-medium text-gray-700">
              No conversations yet
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Start a conversation to see messages here
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <button
          onClick={handleClickAskQuestions}
          className=" cursor-pointer
        w-full flex items-center justify-center gap-2
        bg-green-600 text-white
        px-5 py-3 rounded-full
        text-sm font-semibold
        shadow-md
        hover:bg-green-700
        active:scale-[0.98]
        transition
      "
        >
          Ask a question
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-500 text-xs">
            ?
          </span>
        </button>
      </div>
    </div>
  );
};

export default ChatMessagesLists;

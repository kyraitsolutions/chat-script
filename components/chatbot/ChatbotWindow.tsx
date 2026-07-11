"use clinet";
import { ChatbotProvider, useChatbotContext } from "@/context/ChatbotContext";
import React, { useEffect, useRef } from "react";
import ChatbotFooter from "./ChatbotFooter";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMain from "./ChatbotMain";
import { TChatBotData } from "@/types/chat-bot.type";
import ChatHome from "./ChatbotHome";
import ChatbotTabs from "./ChatbotTabs";
import ChatMessagesLists from "./ChatMessagesLists";
import { clearExpiredSessions } from "@/utils/chatbot/chatbotIndexDb";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { generateVisitorId } from "@/utils/generateVisitorId";
import {
  BASE_URL_API,
  COOKIES_STORAGE_KEY,
  VISITOR_INIT_COOLDOWN,
} from "@/constant/constant";

type ChatbotWindowProps = {
  onClose: () => void;
  chatbotData: TChatBotData | null;
  accountId: string;
  chatbotId: string;
};

const ChatbotWindow = ({
  onClose,
  chatbotData,
  accountId,
  chatbotId,
}: ChatbotWindowProps) => {
  const { view } = useChatbotContext();
  const submitRef = useRef<((msg: string) => void) | null>(null);

  const handleSend = (message: string) => {
    submitRef.current?.(message); // Call Main's submit with message
  };

  const initVisitor = async () => {
    // await clearExpiredSessions();

    const visitor = CookieUtils.getItem(COOKIES_STORAGE_KEY.VISITOR_ID);
    const lastInitedAt = CookieUtils.getItem(COOKIES_STORAGE_KEY.LAST_INIT_AT);

    if (
      visitor &&
      lastInitedAt &&
      Date.now() - Number(lastInitedAt) < VISITOR_INIT_COOLDOWN
    ) {
      return;
    }

    let finalVisitorId = visitor;

    if (!finalVisitorId) {
      const visitorId = generateVisitorId();
      CookieUtils.setItem(COOKIES_STORAGE_KEY.VISITOR_ID, visitorId);
      finalVisitorId = visitorId;
    }

    await fetch(`${BASE_URL_API}/api/visitor/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId,
        visitorId: finalVisitorId,
        platform: "chatbot",
        identifiers: {
          chatbotId,
        },
      }),
    });

    CookieUtils.setItem(COOKIES_STORAGE_KEY.LAST_INIT_AT, Date.now());
  };

  useEffect(() => {
    initVisitor();
  }, []);

  return (
    <main className="sm:rounded-[20px] overflow-hidden shadow-lg h-screen sm:h-153.5 w-screen sm:w-100 min-w-76 flex flex-col sm:mb-2 bg-gray-50">
      {/* chatbot top header  */}
      <ChatbotHeader
        theme={chatbotData?.theme || null}
        name={chatbotData?.name || "Chatbot"}
        onClose={onClose}
      />

      {/* chatbot main content (chatarea, homearea etc)  */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {view === "home" && <ChatHome />}

        {view === "chats" && (
          <ChatMessagesLists chatbotId={chatbotId} accountId={accountId} />
        )}

        {view === "messages area" && (
          <React.Fragment>
            <ChatbotMain
              theme={chatbotData?.theme || null}
              config={chatbotData?.config || null}
              submitRef={submitRef}
              nodes={chatbotData?.flow?.nodes || []}
              edges={chatbotData?.flow?.edges || []}
              accountId={accountId}
              chatbotId={chatbotId}
            />
          </React.Fragment>
        )}
      </div>

      {/* bottom chatbot tabs (home, chat) or input type for message if message area there  */}
      {view !== "messages area" && <ChatbotTabs />}

      {/* chatbot footer (send message)  */}
      {view === "messages area" && (
        <ChatbotFooter onSend={handleSend} theme={chatbotData?.theme || null} />
      )}
    </main>
  );
};

export default ChatbotWindow;

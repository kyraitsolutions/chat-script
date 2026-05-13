"use client";
import WebSocketClient from "@/config/websocketClient";
import {
  COOKIES_STORAGE_KEY,
  WEBSOCKET_EVENTS,
  WEBSOCKET_URL,
} from "@/constant/constant";
import { useChatbotContext } from "@/context/ChatbotContext";
import {
  TChatBotData,
  TChatbotEdge,
  TChatbotNode,
  TChatbotTheme,
} from "@/types/chat-bot.type";
import { getSession, updateSession } from "@/utils/chatbot/chatbotIndexDb";
import { executeNode } from "@/utils/chatbot/flow/executeNode";
import { detectFieldFromQuestion } from "@/utils/leadFieldMapper";
import React, { useEffect, useRef, useState } from "react";
import ChatbotMessage from "./ChatbotMessage";
import { TMessage } from "@/types/message.type";
import TypingIndicator from "../typingIndicator/TypingIndicator";
import { resolveNextNode } from "@/utils/chatbot/flow/resolveNextNode";
import { saveMessagesToBackend } from "@/services/sendMessage";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { persistMessages } from "@/utils/persistMessage";
import { generateMessageId } from "@/utils/generateMessageId";

// type Message = {
//   from: "bot" | "user";
//   text: string;
//   options?: {
//     label: string;
//     value: string;
//   }[];
//   optionHandles?: string[];
// };

type ChatbotMainProps = {
  submitRef: React.RefObject<((msg: string) => void) | null>;
  theme: TChatbotTheme | null;
  config: TChatBotData["config"] | null;
  nodes: TChatbotNode[];
  edges: TChatbotEdge[];
  accountId: string;
  chatbotId: string;
};

export type Lead = {
  name: string;
  email: string;
  phone: string;
  customFields: Record<string, string>;
};

const ChatbotMain: React.FC<ChatbotMainProps> = ({
  submitRef,
  nodes,
  edges,
  accountId,
  theme,
  config,
  chatbotId,
}) => {
  const { activeSessionId, conversationId, setInputConfig } =
    useChatbotContext();
  const wsRef = useRef<WebSocketClient | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const endMessageAreaDivRef = useRef<HTMLDivElement | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState(() =>
    nodes && nodes.length > 0 ? nodes[0].id : null,
  );
  const [typingIndicator, setTypingIndicator] = useState(false);

  const [lead, setLead] = useState<Lead>({
    name: "",
    email: "",
    phone: "",
    customFields: {},
  });

  // Initialize first node messages

  const [messages, setMessages] = useState<TMessage[]>([]);

  //handleShowUserMessage to add user message to show in UI
  const handleShowUserMessage = async ({
    msg,
    replyId,
    messageId,
  }: {
    msg?: string;
    replyId?: string;
    messageId?: string;
  }) => {
    const visitorId = CookieUtils.getItem(COOKIES_STORAGE_KEY.VISITOR_ID) || "";
    const currentMessage = messages.find((m) => m.messageId === messageId);

    const messagePayload: TMessage = {
      messageId: generateMessageId({
        direction: "inbound",
        platform: "chatbot",
        type: "text",
      }),
      from: "user",
      type: "text",
      body: {
        text: msg || "",
      },
      status: "delivered",
      direction: "inbound",
      platform: "chatbot",
      ...(replyId && {
        context: {
          messageId,
          message:
            currentMessage?.type === "interactive"
              ? currentMessage?.interactive?.body?.text
              : "",
        },
      }),
      ...(visitorId && { visitorId: String(visitorId) }),
      ...(conversationId && { conversationId: String(conversationId) }),
      ...(accountId && { accountId: String(accountId) }),
    };

    // UI
    setMessages((prev) => [...prev, messagePayload]);

    // BACKEND;
    await persistMessages({
      ...messagePayload,
    });

    return messagePayload;
  };

  // handleSendChatToServerViaWebsocket
  const handleSendChatToServerViaWebsocket = (
    botReplyData: Message[],
    userAnswer?: string,
  ) => {
    const lastBotMessage = messages[messages.length - 1]; // last bot question
    const detectedField = detectFieldFromQuestion(lastBotMessage.text);

    // Send all prev chat to server via websocket and set lead
    setLead((prev) => {
      const updatedLead = { ...prev };
      if (detectedField && detectedField in updatedLead) {
        // Known field (name/email/phone)
        updatedLead[detectedField as "name" | "email" | "phone"] =
          userAnswer || "";
      } else {
        // Custom field
        updatedLead.customFields = {
          ...prev.customFields,
          [lastBotMessage.text]: userAnswer || "",
        };
      }

      return updatedLead;
    });

    setMessages((prev) => {
      return [...prev, ...botReplyData];
    });
  };

  const handlePersistMessages = async (messages: TMessage[]) => {
    const visitorId = CookieUtils.getItem(COOKIES_STORAGE_KEY.VISITOR_ID) || "";

    if (messages?.length >= 2) {
      for (let i = 0; i < messages.length; i++) {
        await persistMessages({
          ...messages[i],
          chatbotId: chatbotId,
          accountId: String(accountId),
          visitorId: String(visitorId),
          conversationId: String(conversationId),
        });
      }

      return;
    }

    await persistMessages({
      ...messages[0],
      chatbotId: chatbotId,
      accountId: String(accountId),
      visitorId: String(visitorId),
      conversationId: String(conversationId),
    });
  };

  // handleUserReplyByBot to prepare bot replies
  const handleUserReplyByBot = async ({
    replyId,
    msg,
  }: {
    replyId?: string;
    msg?: string;
  }) => {
    // const outgoingEdge = getOutgoingEdge(edges);
    // const matchedEdge = getMatchedEdge(outgoingEdge, sourceHandle); // fallback to first edge if no handle
    // const nextNodeId = matchedEdge?.target;
    // if (!nextNodeId) return;
    // const nextNode = getNextNode(nodes, nextNodeId);
    // if (!nextNode) return;
    // await updateSession(activeSessionId!, {
    //   currentNodeId: nextNodeId,
    // });
    // // Prepare bot replies
    // const botReplyData: Message[] = nextNode?.data?.elements?.map((el) => {
    //   if (el.type === "option") {
    //     return {
    //       from: "bot",
    //       text: el.content || "",
    //       options: el.choices?.map((c, i) => {
    //         return {
    //           label: c,
    //           value: `${el.id}-choice-${i}`,
    //         };
    //       }),
    //       optionHandles: el.choices?.map((_, i) => `${el.id}-choice-${i}`),
    //     };
    //   }
    //   return { from: "bot", text: el.content || "" };
    // });
    // handleSendChatToServerViaWebsocket(botReplyData, msg);
    // // Send all prev chat to server via websocket
    // // setMessages((prev) => [...prev, ...botReplyData]);
  };

  // handleSend to send message
  const handleSend = (msg: string) => {
    if (!msg.trim() || !currentNodeId) return;
    // // Add user message to show in UI
    handleShowUserMessage({ msg });

    const nextEdge = resolveNextNode({
      edges,
      currentNodeId,
    });

    executeNode({
      nodeId: String(nextEdge?.target),
      nodes,
      edges,
      setMessages,
      setTypingIndicator,
      setCurrentNodeId,
      setInputConfig,
      onMessages: handlePersistMessages,
    });
  };

  const handleButtonReply = async ({
    replyId,
    msg,
    messageId,
  }: {
    replyId?: string;
    msg?: string;
    messageId?: string;
  }) => {
    if (!replyId) return;
    handleShowUserMessage({ replyId, msg, messageId });

    const nextEdge = resolveNextNode({
      edges,
      sourceHandle: replyId,
    });

    if (!nextEdge?.target) return;

    executeNode({
      nodeId: nextEdge.target,
      nodes,
      edges,
      setMessages,
      setTypingIndicator,
      setCurrentNodeId,
      sourceHandle: replyId,
      setInputConfig,
      onMessages: handlePersistMessages,
    });
  };

  const handleSetInitialMessage = () => {
    const firstNode = nodes?.[0];
    if (!firstNode) return [];

    executeNode({
      nodeId: firstNode.id,
      nodes,
      edges,
      setMessages,
      setTypingIndicator,
      setCurrentNodeId,
      setInputConfig,
      onMessages: handlePersistMessages,
    });
  };

  // const initSession = async () => {
  //   setLoading(true);
  //   sessionIdRef.current = activeSessionId;
  //   const session = await getSession(activeSessionId!);
  //   if (session && session?.messages && session?.messages.length > 0) {
  //     setMessages(session?.messages || []);
  //     setCurrentNodeId(session?.currentNodeId || null);
  //     setLeadId(session?.leadId || null);
  //     setLead(session?.lead as Lead);
  //   } else {
  //     setMessages([]);
  //     handleSetInitialMessage();
  //   }
  // };

  const initSession = async () => {
    if (!activeSessionId) return;

    setMessages([]);
    setLoading(true);
    sessionIdRef.current = activeSessionId;
    const session = await getSession(activeSessionId);

    if (session && session.messages && session.messages.length > 0) {
      setMessages(session.messages);
      setCurrentNodeId(session.currentNodeId || null);
      // setLeadId(session.leadId || null);
      // setLead(session.lead as Lead);
    } else {
      handleSetInitialMessage();
    }

    setLoading(false);
  };

  // Connect to websocket
  useEffect(() => {
    wsRef.current = new WebSocketClient(
      `${WEBSOCKET_URL}?accountId=${accountId}`,
    );

    wsRef.current.connect(async (serverResponse) => {
      if (serverResponse.event === WEBSOCKET_EVENTS["Chatbot Lead Created"]) {
        setLeadId(serverResponse.data?.lead?._id);
        await updateSession(activeSessionId!, {
          leadId: serverResponse.data?.lead?._id,
        });
      }
    });

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // Initialize submitRef
  useEffect(() => {
    submitRef.current = handleSend;
  }, [handleSend]);

  // Scroll to bottom
  useEffect(() => {
    endMessageAreaDivRef.current?.scrollIntoView({ behavior: "smooth" });

    if (!sessionIdRef.current) return;
    if (messages.length === 0) return;

    const timeout = setTimeout(() => {
      updateSession(sessionIdRef.current!, {
        currentNodeId,
        messages,
        updatedAt: Date.now(),
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [messages]);

  // Init session
  useEffect(() => {
    initSession();
  }, [activeSessionId]);

  // Send lead to server
  useEffect(() => {
    const payLoad = {
      ...(leadId && { id: leadId }),
      accountId: accountId,
      source: { name: "chatbot" },
    };

    wsRef.current?.send({
      event: leadId
        ? WEBSOCKET_EVENTS["Chatbot Lead Updated"]
        : WEBSOCKET_EVENTS["Chatbot Lead Created"],
      data: {
        ...payLoad,
        ...lead,
      },
    });

    const updateLeadSession = async () => {
      await updateSession(activeSessionId!, {
        lead,
      });
    };

    if (lead?.email || lead?.phone || lead?.name) {
      updateLeadSession();
    }
  }, [lead]);

  useEffect(() => {
    const updateSessionForLeadId = async () => {
      await updateSession(activeSessionId!, {
        leadId: leadId,
      });
    };
    if (leadId) {
      updateSessionForLeadId();
    }
  }, [leadId]);

  return (
    <div className=" overflow-y-auto hide-scrollbar rounded-t-lg shadow bg-white h-full">
      {/* Messages */}
      <div className="p-4 space-y-3">
        {messages.length > 0 &&
          messages.map((msg, idx) => (
            <div className="space-y-2" key={idx}>
              <ChatbotMessage
                message={msg}
                color={{
                  userMessageColor: theme?.userMessageColor,
                  messageColor: theme?.messageColor,
                  backgroundColor: theme?.backgroundColor,
                }}
                onButtonClick={({ id, title, messageId }) =>
                  handleButtonReply({ replyId: id, msg: title, messageId })
                }
              />
            </div>
          ))}

        <div>{typingIndicator && <TypingIndicator />}</div>

        <div ref={endMessageAreaDivRef} />
      </div>
    </div>
  );
};

export default ChatbotMain;

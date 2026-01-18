"use client";
import WebSocketClient from "@/config/websocketClient";
import { WEBSOCKET_EVENTS, WEBSOCKET_URL } from "@/constant/constant";
import { useChatbotContext } from "@/context/ChatbotContext";
import {
  TChatbotEdge,
  TChatbotNode,
  TChatbotTheme,
} from "@/types/chat-bot.type";
import { getSession, updateSession } from "@/utils/chatbotIndexDb";
import { detectFieldFromQuestion } from "@/utils/leadFieldMapper";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatbotMessage from "./ChatbotMessage";

type Message = {
  from: "bot" | "user";
  text: string;
  options?: {
    label: string;
    value: string;
  }[];
  optionHandles?: string[];
};

type ChatbotMainProps = {
  submitRef: React.RefObject<((msg: string) => void) | null>;
  theme: TChatbotTheme | null;
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
  chatbotId,
}) => {
  const { activeSessionId } = useChatbotContext();
  const wsRef = useRef<WebSocketClient | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // const [showInput, setShowInput] = useState(true)
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const endMessageAreaDivRef = useRef<HTMLDivElement | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState(() =>
    nodes && nodes.length > 0 ? nodes[0].id : null,
  );

  const [lead, setLead] = useState<Lead>({
    name: "",
    email: "",
    phone: "",
    customFields: {},
  });

  // Initialize first node messages
  const initialMessages = useMemo(() => {
    const firstNode = nodes?.[0];
    if (!firstNode) return [];

    return firstNode?.data?.elements
      .filter((el) => el.type === "text")
      .map((el) => ({ from: "bot", text: el.content }));
  }, [nodes]);
  const [messages, setMessages] = useState<Message[]>(
    initialMessages as Message[],
  );

  //handleShowUserMessage to add user message to show in UI
  const handleShowUserMessage = (msg: string) => {
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
  };

  // getOutgoingEdge
  const getOutgoingEdge = (edges: TChatbotEdge[]) => {
    return edges.filter((e) => e.source === currentNodeId);
  };

  // getMatchedEdge
  const getMatchedEdge = (
    outgoingEdge: TChatbotEdge[],
    sourceHandle?: string,
  ) => {
    return sourceHandle
      ? outgoingEdge.find((e) => e.sourceHandle === sourceHandle)
      : outgoingEdge[0];
  };

  // getNextNode
  const getNextNode = (nodes: TChatbotNode[], nextNodeId: string) => {
    setCurrentNodeId(nextNodeId);
    return nodes.find((n) => n.id === nextNodeId);
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

  // handleUserReplyByBot to prepare bot replies
  const handleUserReplyByBot = async (sourceHandle?: string, msg?: string) => {
    const outgoingEdge = getOutgoingEdge(edges);
    const matchedEdge = getMatchedEdge(outgoingEdge, sourceHandle); // fallback to first edge if no handle
    const nextNodeId = matchedEdge?.target;
    if (!nextNodeId) return;
    const nextNode = getNextNode(nodes, nextNodeId);
    if (!nextNode) return;
    await updateSession(activeSessionId!, {
      currentNodeId: nextNodeId,
    });
    // Prepare bot replies
    const botReplyData: Message[] = nextNode?.data?.elements?.map((el) => {
      if (el.type === "option") {
        return {
          from: "bot",
          text: el.content || "",
          options: el.choices?.map((c, i) => {
            return {
              label: c,
              value: `${el.id}-choice-${i}`,
            };
          }),
          optionHandles: el.choices?.map((_, i) => `${el.id}-choice-${i}`),
        };
      }
      return { from: "bot", text: el.content || "" };
    });

    handleSendChatToServerViaWebsocket(botReplyData, msg);
    // Send all prev chat to server via websocket
    // setMessages((prev) => [...prev, ...botReplyData]);
  };

  // handleSend to send message
  const handleSend = (
    msg: string,
    option?: { label: string; value: string },
  ) => {
    if (!msg.trim() || !currentNodeId) return;
    // Add user message to show in UI
    handleShowUserMessage(msg);
    // Prepare bot replies
    if (!option) {
      handleUserReplyByBot(undefined, msg);
    } else {
      handleUserReplyByBot(option.value, msg);
    }
  };

  // Initialize submitRef
  useEffect(() => {
    submitRef.current = handleSend;
  }, [handleSend]);

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

  // Scroll to bottom
  useEffect(() => {
    endMessageAreaDivRef.current?.scrollIntoView({ behavior: "smooth" });

    if (!sessionIdRef.current) return;
    if (messages.length === 0) return;

    const timeout = setTimeout(() => {
      updateSession(sessionIdRef.current!, {
        messages,
        updatedAt: Date.now(),
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [messages]);

  // Init session
  useEffect(() => {
    const initSession = async () => {
      setLoading(true);
      sessionIdRef.current = activeSessionId;
      const session = await getSession(activeSessionId!);
      if (session && session?.messages && session?.messages.length > 2) {
        setMessages(session?.messages || []);
        setCurrentNodeId(session?.currentNodeId || null);
        setLeadId(session?.leadId || null);
        setLead(session?.lead as Lead);
      }
    };

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

  console.log(lead);

  return (
    <div className=" overflow-y-auto hide-scrollbar rounded-t-lg shadow bg-white h-full">
      {/* Messages */}
      <div className="p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <ChatbotMessage
              from={msg.from}
              text={msg.text}
              color={{
                userMessageColor: theme?.userMessageColor,
                messageColor: theme?.messageColor,
              }}
            />

            {msg.options && msg.options.length > 0 && msg.optionHandles && (
              <div className="flex flex-wrap gap-2 mt-4">
                {msg.options.map((opt) => (
                  <button
                    key={opt.value}
                    className="bg-gray-50 hover:bg-gray-300 border border-slate-200 shadow-md text-gray-800 px-5 py-1  rounded-full text-sm transition cursor-pointer"
                    onClick={() => handleSend(opt.label, opt)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div ref={endMessageAreaDivRef} />
      </div>
    </div>
  );
};

export default ChatbotMain;

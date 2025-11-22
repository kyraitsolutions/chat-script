"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatbotMessage from "./ChatbotMessage";
import { TChatEdge, TChatNode } from "./ChatbotWidget";
import WebSocketClient from "@/config/websocketClient";
import { WEBSOCKET_EVENTS, WEBSOCKET_URL } from "@/constant/constant";
import { detectFieldFromQuestion } from "@/utils/leadFieldMapper";

type Message = {
  from: "bot" | "user";
  text: string;
  options?: string[];
  optionHandles?: string[];
};

type ChatbotMainProps = {
  submitRef: React.RefObject<((msg: string) => void) | null>;
  nodes: TChatNode[];
  edges: TChatEdge[];
  accountId: string;
  chatbotId: string;
};

type Lead = {
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
  chatbotId,
}) => {
  const wsRef = useRef<WebSocketClient | null>(null);

  const [leadId, setLeadId] = useState<string | null>(null);
  const endMessageAreaDivRef = useRef<HTMLDivElement | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState(() =>
    nodes && nodes.length > 0 ? nodes[0].id : null
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

    return firstNode.data.elements
      .filter((el) => el.type === "text")
      .map((el) => ({ from: "bot", text: el.content }));
  }, [nodes]);
  const [messages, setMessages] = useState<Message[]>(
    initialMessages as Message[]
  );

  //handleShowUserMessage to add user message to show in UI
  const handleShowUserMessage = (msg: string) => {
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
  };

  // getOutgoingEdge
  const getOutgoingEdge = (edges: TChatEdge[]) => {
    return edges.filter((e) => e.source === currentNodeId);
  };

  // getMatchedEdge
  const getMatchedEdge = (outgoingEdge: TChatEdge[], sourceHandle?: string) => {
    return sourceHandle
      ? outgoingEdge.find((e) => e.sourceHandle === sourceHandle)
      : outgoingEdge[0];
  };

  // getNextNode
  const getNextNode = (nodes: TChatNode[], nextNodeId: string) => {
    setCurrentNodeId(nextNodeId);
    return nodes.find((n) => n.id === nextNodeId);
  };

  // handleSendChatToServerViaWebsocket
  const handleSendChatToServerViaWebsocket = (
    botReplyData: Message[],
    userAnswer?: string
  ) => {
    const lastBotMessage = messages[messages.length - 1]; // last bot question
    const detectedField = detectFieldFromQuestion(lastBotMessage.text);

    // Send all prev chat to server via websocket and set lead
    setLead((prev) => {
      const updatedLead = { ...prev };
      if (detectedField && detectedField in updatedLead) {
        // Known field (name/email/phone)
        updatedLead[detectedField] = userAnswer;
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
  const handleUserReplyByBot = (sourceHandle?: string, msg?: string) => {
    const outgoingEdge = getOutgoingEdge(edges);
    const matchedEdge = getMatchedEdge(outgoingEdge, sourceHandle); // fallback to first edge if no handle
    const nextNodeId = matchedEdge?.target;
    if (!nextNodeId) return;
    const nextNode = getNextNode(nodes, nextNodeId);
    if (!nextNode) return;
    // Prepare bot replies
    const botReplyData: Message[] = nextNode?.data?.elements?.map((el) => {
      if (el.type === "option") {
        return {
          from: "bot",
          text: el.title || "",
          options: el.choices,
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
  const handleSend = (msg: string) => {
    if (!msg.trim() || !currentNodeId) return;
    // Add user message to show in UI
    handleShowUserMessage(msg);
    // Prepare bot replies
    handleUserReplyByBot(undefined, msg);
  };

  // Initialize submitRef
  useEffect(() => {
    submitRef.current = handleSend;
  }, [handleSend]);

  // Scroll to bottom
  useEffect(() => {
    endMessageAreaDivRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send lead to server
  useEffect(() => {
    if (!lead) return;

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
  }, [lead]);

  // Connect to websocket
  useEffect(() => {
    wsRef.current = new WebSocketClient(
      `${WEBSOCKET_URL}?accountId=${accountId}`
    );

    wsRef.current.connect((serverResponse) => {
      console.log(serverResponse);
      if (serverResponse.event === WEBSOCKET_EVENTS["Chatbot Lead Created"]) {
        setLeadId(serverResponse.data?.lead?._id);
      }
    });

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar rounded-lg shadow bg-white">
      {/* Messages */}
      <div className="p-4 space-y-3">
        {messages.map((msg, idx) => (
          <ChatbotMessage key={idx} from={msg.from} text={msg.text} />
        ))}

        {/* {msg.options && msg.options.length > 0 && msg.optionHandles && (
          <div className="flex flex-wrap gap-2 mt-4">
            {msg.options.map((opt, idx) => (
              <button
                key={opt}
                className="bg-gray-50 hover:bg-gray-300 border border-slate-200 shadow-md text-gray-800 px-3 py-2 rounded-full text-sm transition cursor-pointer"
                onClick={() => handleUserReply(opt, msg.optionHandles?.[idx])}
              >
                {opt}
              </button>
            ))}
          </div>
        )} */}
        <div ref={endMessageAreaDivRef} />
      </div>
    </div>
  );
};

export default ChatbotMain;

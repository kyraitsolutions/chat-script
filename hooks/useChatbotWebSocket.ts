// hooks/useChatbotSocket.ts
import { WEBSOCKET_URL } from "@/constant/constant";
import { useEffect, useRef, useState } from "react";

type Props = {
  visitorId: string;
  accountId: string;
  chatbotId: string;
};

export const useChatbotWebSocket = ({
  visitorId,
  accountId,
  chatbotId,
}: Props) => {
  const socketRef = useRef<WebSocket | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!visitorId) return;

    const ws = new WebSocket(
      `${WEBSOCKET_URL}/ws?visitorId=${visitorId}&accountId=${accountId}&chatbotId=${chatbotId}`,
    );

    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);

      ws.send(
        JSON.stringify({
          type: "VISITOR_ONLINE",
          payload: {
            visitorId,
            accountId,
            chatbotId,
          },
        }),
      );
    };

    ws.onclose = () => {
      console.log("Socket disconnected");

      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.log("Socket error", err);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data);

      switch (data.type) {
        case "AGENT_STATUS":
          break;

        case "NEW_MESSAGE":
          break;

        case "VISITOR_TYPING":
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [visitorId, accountId, chatbotId]);

  return {
    socket: socketRef?.current,
    isConnected,
  };
};

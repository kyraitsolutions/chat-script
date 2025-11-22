class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectInterval = 3000;
  private shouldReconnect = true;

  constructor(url: string) {
    this.url = url;
  }

  connect(onMessage: (data: any) => void) {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("WebSocket connected 🚀");
    };

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch (error) {
        console.error("Invalid WS JSON:", event.data);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket closed");
      if (this.shouldReconnect) {
        setTimeout(() => {
          console.log("Reconnecting WebSocket...");
          this.connect(onMessage);
        }, this.reconnectInterval);
      }
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }

  send(payload: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    } else {
      console.warn("WebSocket not connected — cannot send");
    }
  }

  close() {
    this.shouldReconnect = false;
    this.socket?.close();
  }
}

export default WebSocketClient;

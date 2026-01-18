export const BASE_URL_API = "http://localhost:3000";
export const WEBSOCKET_URL = "ws://localhost:3000";

// export const BASE_URL_API = "https://chat.kyracr";
// export const WEBSOCKET_URL = "ws://localhost:3000";

export const CHATBOT_DB = {
  config: {
    DB_NAME: "chatbot-db",
    DB_VERSION: 1,
    STORE_NAME: "sessions",
  },

  localStorage: {
    SESSION_ID_KEY: "_v_sik_cb_ses_id",
  },
};

export const WEBSOCKET_EVENTS = {
  "Chatbot Lead Created": "CHATBOT:LEAD:CREATE",
  "Chatbot Lead Updated": "CHATBOT:LEAD:UPDATE",
};

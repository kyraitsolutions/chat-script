export const BASE_URL_API = "http://localhost:3000";
export const WEBSOCKET_URL = "ws://localhost:3000";

// export const BASE_URL_API = "https://chat.kyracr";
// export const WEBSOCKET_URL = "ws://localhost:3000";

export const VISITOR_INIT_COOLDOWN = 2 * 60 * 1000;

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

export const COOKIES_STORAGE_KEY = {
  VISITOR_ID: "vst_sik_app_i_d_tor",
  LAST_INIT_AT: "vst_i_n_lst_a_pp_i_at",
};

export const WEBSOCKET_EVENTS = {
  "Chatbot Lead Created": "CHATBOT:LEAD:CREATE",
  "Chatbot Lead Updated": "CHATBOT:LEAD:UPDATE",
};

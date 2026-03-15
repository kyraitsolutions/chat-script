import { CHATBOT_DB } from "@/constant/constant";

export const getSessionId = (chatbotId: string) => {
  const key = `${CHATBOT_DB.localStorage.SESSION_ID_KEY}-${chatbotId}`;
  const sessionId = localStorage.getItem(key);

  return sessionId;
};

export const setSessionId = (chatbotId: string, sessionId: string) => {
  const key = `${CHATBOT_DB.localStorage.SESSION_ID_KEY}-${chatbotId}`;
  localStorage.setItem(key, sessionId);
};

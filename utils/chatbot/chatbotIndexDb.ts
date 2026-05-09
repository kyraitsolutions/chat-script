import { Lead } from "@/components/chatbot/ChatbotMain";
import { CHATBOT_DB } from "@/constant/constant";
import { TMessage } from "@/types/message.type";

const TWO_DAYS = 10 * 1000;

export type ChatSession = {
  sessionId: string;
  chatbotId: string;
  messages?: TMessage[];
  currentNodeId?: string | null;
  leadId?: string | null;
  lead?: Lead | null;
  createdAt: number;
  updatedAt: number;
};

/* ================================
   Open DB
================================ */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      CHATBOT_DB.config.DB_NAME,
      CHATBOT_DB.config.DB_VERSION,
    );

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CHATBOT_DB.config.STORE_NAME)) {
        db.createObjectStore(CHATBOT_DB.config.STORE_NAME, {
          keyPath: "sessionId",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/* ================================
   CRUD Helpers
================================ */

export const getSession = async (
  sessionId: string,
): Promise<ChatSession | null> => {
  const db = await openDB();

  return new Promise((resolve) => {
    const tx = db.transaction(CHATBOT_DB.config.STORE_NAME, "readonly");
    const store = tx.objectStore(CHATBOT_DB.config.STORE_NAME);
    const req = store.get(sessionId);

    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
};

export const createSession = async (session: ChatSession) => {
  const db = await openDB();

  // const key = `${CHATBOT_DB.localStorage.SESSION_ID_KEY}-${session?.chatbotId}`;
  // localStorage.setItem(key, session.sessionId);

  return new Promise<void>((resolve) => {
    const tx = db.transaction(CHATBOT_DB.config.STORE_NAME, "readwrite");
    tx.objectStore(CHATBOT_DB.config.STORE_NAME).put(session);
    tx.oncomplete = () => resolve();
  });
};

export const updateSession = async (
  sessionId: string,
  data: Partial<ChatSession>,
) => {
  const db = await openDB();

  return new Promise<void>((resolve) => {
    const tx = db.transaction(CHATBOT_DB.config.STORE_NAME, "readwrite");
    const store = tx.objectStore(CHATBOT_DB.config.STORE_NAME);

    const getReq = store.get(sessionId);
    getReq.onsuccess = () => {
      if (!getReq.result) return resolve();

      store.put({
        ...getReq.result,
        ...data,
        updatedAt: Date.now(),
      });
    };

    tx.oncomplete = () => resolve();
  });
};

export const getAllSessionsByChatbot = async (
  chatbotId: string,
): Promise<ChatSession[]> => {
  const db = await openDB();

  return new Promise((resolve) => {
    const tx = db.transaction(CHATBOT_DB?.config?.STORE_NAME, "readonly");
    const store = tx.objectStore(CHATBOT_DB?.config?.STORE_NAME);
    const req = store.getAll();

    req.onsuccess = () => {
      resolve((req.result || []).filter((s) => s.chatbotId === chatbotId));
    };
  });
};

export const deleteSession = async (sessionId: string) => {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(CHATBOT_DB?.config?.DB_NAME);

    request.onsuccess = () => {
      const db = request.result;

      const transaction = db.transaction("sessions", "readwrite");
      const store = transaction.objectStore("sessions");

      const deleteRequest = store.delete(sessionId);

      deleteRequest.onsuccess = () => resolve();

      deleteRequest.onerror = () => reject(deleteRequest.error);
    };

    request.onerror = () => reject(request.error);
  });
};

export const clearExpiredSessions = async () => {
  const db = await openDB();

  return new Promise<void>((resolve) => {
    const tx = db.transaction(CHATBOT_DB.config.STORE_NAME, "readwrite");

    const store = tx.objectStore(CHATBOT_DB.config.STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      const sessions = request.result || [];

      const now = Date.now();

      sessions.forEach((session) => {
        const isExpired = now - session.updatedAt > TWO_DAYS;

        if (isExpired) {
          store.delete(session.sessionId);
        }
      });
    };

    tx.oncomplete = () => resolve();
  });
};

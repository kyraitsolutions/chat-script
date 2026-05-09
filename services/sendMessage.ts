import { BASE_URL_API } from "@/constant/constant";
import { TMessage } from "@/types/message.type";

export const saveMessagesToBackend = async (messages: TMessage) => {
  try {
    await fetch(`${BASE_URL_API}/api/message/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ ...messages }),
    });
  } catch (error) {
    console.error(error);
  }
};

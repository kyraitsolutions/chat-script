import { BASE_URL_API } from "@/constant/constant";

type InitConversationDto = {
  accountId: string;
  visitorId: string;
  platform: string;
  identifiers: {
    [key: string]: string;
  };
};
export const initConversation = async (data: InitConversationDto) => {
  try {
    const response = await fetch(`${BASE_URL_API}/api/conversation/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

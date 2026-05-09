import { TMessage } from "@/types/message.type";
import { saveMessagesToBackend } from "../services/sendMessage";

export const persistMessages = async (message: TMessage) => {
  try {
    await Promise.all([saveMessagesToBackend(message)]);
  } catch (error) {
    console.error(error);
  }
};

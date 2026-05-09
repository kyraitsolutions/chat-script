import { TChatbotNode } from "@/types/chat-bot.type";
import { parseNodeToMessages } from "../../transformers/parseNodeToMessage";

export const sendMessageExecutor = async ({ node }: { node: TChatbotNode }) => {
  return {
    messages: parseNodeToMessages(node),
    waitingForInput: false,
  };
};

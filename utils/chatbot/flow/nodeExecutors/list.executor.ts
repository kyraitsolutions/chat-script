import { TChatbotNode } from "@/types/chat-bot.type";
import { parseNodeToMessages } from "../../transformers/parseNodeToMessage";

export const listExecutor = async ({ node }: { node: TChatbotNode }) => {
  return {
    messages: parseNodeToMessages(node),
    waitingForInput: true,
  };
};

import { TChatbotNode } from "@/types/chat-bot.type";
import { parseNodeToMessages } from "../../transformers/parseNodeToMessage";

export const buttonExecutor = async ({ node }: { node: TChatbotNode }) => {
  const action =
    node?.data?.type === "button"
      ? node?.data?.payload?.interactive?.action
      : null;

  const isButton = action && "buttons" in action ? true : false;

  return {
    messages: parseNodeToMessages(node),
    waitingForInput: isButton ? true : false,
  };
};

import { TChatbotNode } from "@/types/chat-bot.type";
import { parseNodeToMessages } from "../../transformers/parseNodeToMessage";

export const carouselExecutor = async ({ node }: { node: TChatbotNode }) => {
  //   const action =
  //     node?.data?.type === "carousel"
  //       ? node?.data?.payload?.interactive?.action
  //       : null;

  //   const isButton = action && "bu" in action ? true : false;

  return {
    messages: parseNodeToMessages(node),
    waitingForInput: true,
  };
};

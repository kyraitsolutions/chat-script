import { TChatbotNode } from "@/types/chat-bot.type";

export const requiresUserInput = (node: TChatbotNode) => {
  return ["button", "question"].includes(node.type);
};

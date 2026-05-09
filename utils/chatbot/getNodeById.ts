import { TChatbotNode } from "@/types/chat-bot.type";

export const getNodeById = (nodes: TChatbotNode[], nodeId: string) => {
  return nodes.find((node) => node.id === nodeId);
};

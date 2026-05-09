import { TChatbotEdge } from "@/types/chat-bot.type";

export const getOutgoingEdges = (edges: TChatbotEdge[], nodeId: string) => {
  return edges.filter((edge) => edge.source === nodeId);
};

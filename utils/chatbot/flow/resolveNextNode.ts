import { TChatbotEdge } from "@/types/chat-bot.type";

type Props = {
  edges: TChatbotEdge[];
  currentNodeId?: string;
  sourceHandle?: string;
};

export const resolveNextNode = ({
  edges,
  currentNodeId,
  sourceHandle,
}: Props) => {
  // INTERACTIVE FLOW
  // Direct edge lookup by sourceHandle
  if (sourceHandle) {
    return edges.find((edge) => edge.sourceHandle === sourceHandle);
  }

  // NORMAL FLOW
  // First outgoing edge from current node
  if (currentNodeId) {
    return edges.find((edge) => edge.source === currentNodeId);
  }

  return null;
};

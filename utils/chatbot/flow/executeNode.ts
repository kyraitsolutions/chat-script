import { TChatbotEdge, TChatbotNode } from "@/types/chat-bot.type";
import { getNodeById } from "../getNodeById";
import { executors } from "./nodeExecutors";
import { resolveNextNode } from "./resolveNextNode";
import { TMessage } from "@/types/message.type";
import { TInputConfig } from "@/context/ChatbotContext";

type TExecuteNodeProps = {
  nodeId: string;
  nodes: TChatbotNode[];
  edges: TChatbotEdge[];
  setMessages: React.Dispatch<React.SetStateAction<TMessage[]>>;
  setCurrentNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  setTypingIndicator: React.Dispatch<React.SetStateAction<boolean>>;
  setInputConfig: React.Dispatch<React.SetStateAction<TInputConfig>>;
  sourceHandle?: string;
  onMessages?: (messages: TMessage[] | []) => Promise<void> | void;
};

export const executeNode = async ({
  nodeId,
  nodes,
  edges,
  setMessages,
  setCurrentNodeId,
  setTypingIndicator,
  sourceHandle,
  setInputConfig,
  onMessages,
}: TExecuteNodeProps) => {
  setTypingIndicator(true);
  const node = getNodeById(nodes, nodeId);
  if (!node) return;

  if (node.data.type === "question") {
    setInputConfig({
      type: node?.data?.payload?.question?.inputType,
    });
  } else {
    setInputConfig(null);
  }

  // STORE CURRENT NODE
  setCurrentNodeId(node.id);

  // GET EXECUTOR
  const executor = executors[node.data.type as keyof typeof executors];

  if (!executor) return;

  // SHOW TYPING
  setTypingIndicator(true);

  // SMALL DELAY BEFORE MESSAGE
  await new Promise((resolve) => setTimeout(resolve, 300));

  // EXECUTE NODE
  const { messages, waitingForInput } = await executor({
    node,
  });

  // HIDE TYPING
  setTypingIndicator(false);

  // SHOW MESSAGE
  if (messages && messages?.length) {
    setMessages((prev) => [...prev, ...(messages as TMessage[])]);

    await onMessages?.(messages as TMessage[]);
  }

  // WAITING FOR INPUT
  if (waitingForInput) return;

  // RESOLVE NEXT NODE
  const nextEdge = resolveNextNode({
    edges,
    currentNodeId: node.id,
    sourceHandle,
  });

  if (!nextEdge?.target) return;

  // AUTO EXECUTE NEXT
  setTimeout(() => {
    executeNode({
      nodeId: nextEdge.target,
      nodes,
      edges,
      setMessages,
      setCurrentNodeId,
      setTypingIndicator,
      setInputConfig,
      onMessages,
    });
  }, 400);
};

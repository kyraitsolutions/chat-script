import { TMessageType } from "@/types/message.type";

type TGenerateMessageIdProps = {
  platform?: "whatsapp" | "instagram" | "chatbot";
  direction?: "inbound" | "outbound";
  type?: TMessageType;
};

export const generateMessageId = ({
  platform = "chatbot",
  direction = "outbound",
  type = "text",
}: TGenerateMessageIdProps = {}) => {
  const platformPrefix = {
    whatsapp: "wa",
    instagram: "ig",
    chatbot: "cb",
  }[platform];

  const directionPrefix = direction === "inbound" ? "in" : "out";

  const typePrefix = {
    text: "txt",
    image: "img",
    video: "vid",
    audio: "aud",
    template: "tmp",
    interactive: "int",
    question: "qst",
    location: "loc",
    contact: "cnt",
    sticker: "stc",
    document: "doc",
    reaction: "rct",
  }[type];

  return [
    platformPrefix,
    directionPrefix,
    typePrefix,
    crypto.randomUUID(),
  ].join("_");
};

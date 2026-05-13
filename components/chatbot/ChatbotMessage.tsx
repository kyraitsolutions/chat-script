import React from "react";

import { TMessage } from "@/types/message.type";
import DocumentMessage from "./Messages/DocumentMessage";
import ImageMessage from "./Messages/ImageMessage";
import InteractiveMessage from "./Messages/InteractiveMessage";
import QuestionMessage from "./Messages/QuestionMessage";
import TextMessage from "./Messages/TextMessage";
import VideoMessage from "./Messages/VideoMessage";

interface MessageProps {
  message: TMessage;
  color?: {
    userMessageColor?: string;
    messageColor?: string;
    backgroundColor?: string;
  };
  onButtonClick?: ({
    id,
    title,
  }: {
    id: string;
    title: string;
    messageId: string;
  }) => void;
}

const ChatbotMessage: React.FC<MessageProps> = ({
  message,
  color,
  onButtonClick,
}) => {
  const isBot = message?.from === "bot";
  const backgroundColor = isBot ? "#f3f3f5c8" : color?.backgroundColor;
  const userMessageColor = isBot
    ? color?.messageColor
    : color?.userMessageColor;

  const wrapperClass = isBot
    ? "flex gap-1 justify-start"
    : "flex gap-1 justify-end";
  const commonClass = `max-w-[80%] w-auto px-5 py-3 rounded-2xl text-sm shadow-xs border border-gray-200 ${isBot ? "rounded-tl-sm" : "rounded-tr-md"} `;

  switch (message.type) {
    case "text":
      return (
        <TextMessage
          isBot={isBot}
          message={message}
          wrapperClass={wrapperClass}
          commonClass={commonClass}
          theme={{
            backgroundColor,
            color: userMessageColor,
          }}
        />
      );

    case "image":
      return (
        <ImageMessage
          message={message}
          wrapperClass={wrapperClass}
          commonClass={commonClass}
          isBot={isBot}
          theme={{
            backgroundColor,
            color: userMessageColor,
          }}
        />
      );

    case "video":
      return (
        <VideoMessage
          message={message}
          wrapperClass={wrapperClass}
          commonClass={commonClass}
          isBot={isBot}
          theme={{
            backgroundColor,
            color: userMessageColor,
          }}
        />
      );

    case "document":
      return (
        <DocumentMessage
          wrapperClass={wrapperClass}
          commonClass={commonClass}
          isBot={isBot}
          theme={{
            backgroundColor,
            color: userMessageColor,
          }}
          message={message}
        />
      );

    case "interactive":
      return (
        <InteractiveMessage
          message={message}
          wrapperClass={wrapperClass}
          commonClass={commonClass}
          isBot={isBot}
          theme={{
            backgroundColor,
            color: userMessageColor,
          }}
          onButtonClick={onButtonClick}
        />
      );

    case "question":
      return (
        <QuestionMessage
          message={message}
          wrapperClass={wrapperClass}
          commonClass={commonClass}
          isBot={isBot}
          theme={{
            backgroundColor,
            color: userMessageColor,
          }}
        />
      );

    default:
      return null;
  }
};

export default ChatbotMessage;

// import { Message } from "./ChatbotMain";

// interface MessageProps {
//   message: Message;
//   color?: {
//     userMessageColor: string | undefined;
//     messageColor?: string | undefined;
//   };
// }

// const ChatbotMessage: React.FC<MessageProps> = ({ message, color }) => {
//   return (
//     <div
//       style={{
//         color:
//           message?.from === "bot"
//             ? color?.messageColor || "#000"
//             : color?.userMessageColor || color?.userMessageColor || "#000",
//       }}
//       className={`max-w-[80%] px-5 py-2 text-sm rounded-full wrap-break-word ${
//         message?.from === "bot"
//           ? "bg-gray-100 w-fit text-gray-600 self-start"
//           : " w-fit bg-gray-500 text-white self-end ml-auto"
//       }`}
//     >
//       {message?.text}
//     </div>
//   );
// };

// export default ChatbotMessage;

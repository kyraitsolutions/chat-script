import { TMessage } from "@/types/message.type";
import InteractiveButtonMessage from "./InteractiveButtonMessage";
import InteractiveListMessage from "./InteractiveListMessage";

type TInteractiveMessage = {
  message: TMessage;
  wrapperClass: string;
  commonClass: string;
  theme?: {
    backgroundColor?: string;
    color?: string;
  };
  isBot?: boolean;
  onButtonClick?: ({
    id,
    title,
  }: {
    id: string;
    title: string;
    messageId: string;
  }) => void;
};

const InteractiveMessage = ({
  message,
  commonClass,
  wrapperClass,
  theme,
  isBot,
  onButtonClick,
}: TInteractiveMessage) => {
  const interactive =
    message.type === "interactive" ? message?.interactive : null;

  switch (interactive?.type) {
    case "button":
      return (
        <InteractiveButtonMessage
          message={message}
          wrapperClass={wrapperClass}
          commonClass={commonClass}
          theme={theme}
          isBot={isBot}
          onButtonClick={onButtonClick}
        />
      );

    case "list":
      return (
        <InteractiveListMessage
          message={message}
          wrapperClass={wrapperClass}
          commonClass={commonClass}
          theme={theme}
          isBot={isBot}
          onButtonClick={onButtonClick}
        />
      );

    default:
      return null;
  }
};

export default InteractiveMessage;

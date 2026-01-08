interface MessageProps {
  from: "bot" | "user";
  text: string;
  color?: {
    userMessageColor: string | undefined;
    messageColor?: string | undefined;
  };
}

const ChatbotMessage: React.FC<MessageProps> = ({ from, text, color }) => {
  return (
    <div
      style={{
        color:
          from === "bot"
            ? color?.messageColor || "#000"
            : color?.userMessageColor || color?.userMessageColor || "#000",
      }}
      className={`max-w-[80%] px-5 py-2 text-sm rounded-full wrap-break-word ${
        from === "bot"
          ? "bg-gray-100 w-fit text-gray-600 self-start"
          : " w-fit bg-gray-500 text-white self-end ml-auto"
      }`}
    >
      {text}
    </div>
  );
};

export default ChatbotMessage;

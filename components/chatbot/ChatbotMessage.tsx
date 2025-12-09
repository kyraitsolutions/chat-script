interface MessageProps {
  from: "bot" | "user";
  text: string;
}

const ChatbotMessage: React.FC<MessageProps> = ({ from, text }) => {
  return (
    <div
      className={`max-w-[80%] px-4 py-2 rounded-lg wrap-break-word ${
        from === "bot"
          ? "bg-gray-100 w-fit text-black self-start"
          : "bg-linear-to-br w-fit from-blue-500/90 via-indigo-500/90 to-purple-600/70 text-white self-end ml-auto"
      }`}
    >
      {text}
    </div>
  );
};

export default ChatbotMessage;

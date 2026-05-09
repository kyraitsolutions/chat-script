import { Bot } from "lucide-react";

type TypingIndicatorProps = {
  text?: string;
  className?: string;
};

const TypingIndicator = ({
  text = "Typing",
  className = "",
}: TypingIndicatorProps) => {
  return (
    <div className={`flex gap-2 items-end ${className}`}>
      {/* Avatar */}
      <div className="size-5 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
        <Bot size={12} className=" text-white" />
      </div>

      {/* Bubble */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-tl-md px-4 py-3 max-w-fit">
        <div className="flex items-center gap-1.5">
          {/* <span className="text-sm text-gray-500 font-medium">{text}</span> */}

          {/* Dots */}
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
            <span className="size-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
            <span className="size-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

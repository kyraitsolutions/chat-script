import { TMessage } from "@/types/message.type";
import { Bot, CalendarDays, Mail, Phone, Type } from "lucide-react";
import React from "react";

type TQuestionMessageProps = {
  message: TMessage;
  wrapperClass: string;
  commonClass: string;
  theme?: {
    backgroundColor?: string;
    color?: string;
  };
  isBot?: boolean;
};

const inputIcons = {
  text: Type,
  email: Mail,
  phone: Phone,
  date: CalendarDays,
};

const inputPlaceholders = {
  text: "Type your answer...",
  email: "Enter your email...",
  phone: "Enter your phone number...",
  date: "Select a date...",
};

const QuestionMessage = ({
  message,
  wrapperClass,
  commonClass,
  theme,
  isBot,
}: TQuestionMessageProps) => {
  const question = message.type === "question" ? message.question : null;

  if (!question) return null;

  const Icon =
    inputIcons[question.inputType as keyof typeof inputIcons] || Type;

  return (
    <div className={wrapperClass}>
      {/* BOT AVATAR */}
      {isBot && (
        <div className="size-6 rounded-full flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br from-slate-500 to-indigo-800">
          <Bot size={13} color="#fff" />
        </div>
      )}

      {/* QUESTION CARD */}
      <div
        className={`
          ${commonClass}
          max-w-[85%]
          rounded-[22px]
          px-4
          py-3
          shadow-md
          space-y-3
        `}
        style={{
          backgroundColor: theme?.backgroundColor,
          color: theme?.color,
        }}
      >
        {/* QUESTION */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 opacity-80">
            <Icon size={15} />
            <span className="text-xs font-medium uppercase tracking-wide">
              {question.inputType}
            </span>
          </div>

          <p className="text-[15px] leading-relaxed font-medium">
            {question.text}
          </p>
        </div>

        {/* INPUT PREVIEW */}
        {/* <div
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-black/10
            border
            border-white/10
            px-3
            py-2.5
            opacity-80
          "
        >
          <Icon size={16} className="shrink-0 opacity-70" />

          <span className="text-sm opacity-70">
            {
              inputPlaceholders[
                question.inputType as keyof typeof inputPlaceholders
              ]
            }
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default QuestionMessage;

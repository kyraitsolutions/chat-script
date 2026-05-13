"use client";

import { useChatbotContext } from "@/context/ChatbotContext";
import { TChatbotTheme } from "@/types/chat-bot.type";
import React from "react";
import { CalendarDays, Mail, Phone, Type } from "lucide-react";
import { TbSend } from "react-icons/tb";
import { DatePicker } from "../ui/DatePicker/DatePicker";

type ChatbotFooterProps = {
  theme: TChatbotTheme | null;
  onSend: (message: string) => void;
};

const inputIcons = {
  text: Type,
  email: Mail,
  phone: Phone,
  date: CalendarDays,
};

const ChatbotFooter: React.FC<ChatbotFooterProps> = ({ theme, onSend }) => {
  const { input, setInput, inputConfig } = useChatbotContext();

  const handleSend = () => {
    if (!input?.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  const CurrentIcon =
    inputIcons[inputConfig?.type as keyof typeof inputIcons] || Type;

  const renderInputFields = () => {
    switch (inputConfig?.type) {
      case "date":
        return (
          <div>
            {/* <DatePicker range onChange={(date) => console.log(date)} /> */}
            <input type="date" onChange={(e) => setInput(e.target.value)} />
          </div>
        );

      case "text":
        return (
          <textarea
            // disabled
            required
            value={input || ""}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === "enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
                setInput("");
              }
            }}
            placeholder={inputConfig?.placeholder || "Type a message..."}
            className=" w-full bg-transparen text-sm outline-none  placeholder:text-gray-400 min-h-10 hide-scrollbar resize-none"
          />
        );
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-3 py-2">
      <form className="flex items-center gap-2" onSubmit={handleFormSubmit}>
        {/* INPUT WRAPPER */}
        <div className=" flex gap-2 flex-1 rounded-2xl border border-gray-100 bg-gray-100 px-3 py-2 min-h-10  transition-all divide-x divide-gray-400">
          {/* ICON */}
          <div className="shrink-0 opacity-40 pr-1.5 py-0.5 self-start">
            <CurrentIcon size={15} />
          </div>

          {renderInputFields()}

          {/* INPUT */}
          {/* <input
            type={
              inputConfig?.type === "phone"
                ? "tel"
                : inputConfig?.type || "text"
            }
            required
            value={input || ""}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputConfig?.placeholder || "Type a message..."}
            className="
              w-full
              bg-transparent
              py-2
              text-sm
              outline-none
              placeholder:text-gray-400
            "
          /> */}
        </div>

        {/* SEND BUTTON */}
        <button
          disabled={!input || !inputConfig}
          type="submit"
          style={{
            backgroundColor: theme?.backgroundColor || "#4f46e5",
          }}
          className=" flex size-11 shrink-0 items-center justify-center rounded-full shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-80 disabled:cursor-auto disabled:hover:scale-100"
        >
          <TbSend color="#fff" size={18} />
        </button>
      </form>
      {/* FOOTER */}
      <p className="mt-2 text-center text-[10px] text-gray-400">
        Product by: Kyra IT Solutions
      </p>
    </div>
  );
};

export default ChatbotFooter;

// "use client";
// import { useChatbotContext } from "@/context/ChatbotContext";
// import { TChatbotTheme } from "@/types/chat-bot.type";
// import React from "react";
// import { TbSend } from "react-icons/tb";

// type ChatbotFooterProps = {
//   theme: TChatbotTheme | null;
//   onSend: (message: string) => void;
// };

// const ChatbotFooter: React.FC<ChatbotFooterProps> = ({ theme, onSend }) => {
//   const { input, setInput, inputConfig } = useChatbotContext();

//   console.log(inputConfig);

//   const handleSend = () => {
//     if (!input?.trim()) return;
//     onSend(input.trim());
//     setInput("");
//   };

//   const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     handleSend();
//   };

//   return (
//     <div className="p-2 border-t border-t-gray-300 bg-white">
//       <form
//         className="flex items-center gap-5 w-full"
//         onSubmit={handleFormSubmit}
//       >
//         {/* Input */}
//         <input
//           type="text"
//           required
//           value={input || ""}
//           onChange={(e) => setInput(e.target.value)}
//           // onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           placeholder="Type a message..."
//           className="w-full px-4 py-2.5 outline-none"
//         />

//         {/* Send Icon — inside input */}
//         <button
//           // onClick={handleSend}
//           style={{
//             backgroundColor: theme?.backgroundColor || "#fefefe",
//           }}
//           className="
//           p-2 rounded-full bg-gray-500
//           hover:opacity-90 transition-all shadow-md cursor-pointer"
//         >
//           <TbSend color={`#fff`} size={18} />
//         </button>
//       </form>
//       <p className="text-[10px] text-center mt-2 text-gray-400">
//         Product by: Kyra IT Solutions
//       </p>
//     </div>
//   );
// };

// export default ChatbotFooter;

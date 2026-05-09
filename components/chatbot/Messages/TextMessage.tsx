import { TMessage } from "@/types/message.type";
import { Bot, Reply, User } from "lucide-react";

type TTextMessageProps = {
  message: TMessage;
  wrapperClass: string;
  commonClass: string;
  theme?: {
    backgroundColor?: string;
    color?: string;
  };
  isBot?: boolean;
};

const truncateText = (text: string, limit = 80) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};

const TextMessage = ({
  wrapperClass,
  commonClass,
  message,
  theme,
  isBot,
}: TTextMessageProps) => {
  const msg = message?.type === "text" ? message : null;

  const repliedContext = message?.context?.message;

  return (
    <div className={wrapperClass}>
      {/* BOT AVATAR */}
      {isBot && (
        <div className="size-5 rounded-full flex items-center justify-center shrink-0 shadow-md bg-linear-to-br from-slate-500 to-indigo-800">
          <Bot size={13} color="#fff" />
        </div>
      )}

      {/* MESSAGE BUBBLE */}
      <div
        className={`${commonClass}`}
        style={{
          backgroundColor: theme?.backgroundColor,
          color: theme?.color,
        }}
      >
        {/* REPLY CARD */}
        {repliedContext && (
          <div className="relative mb-2.5 overflow-hidden rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
            {/* LEFT ACCENT */}
            <div className="absolute left-0 top-0 h-full w-1 bg-white/40" />

            <div className="pl-3 pr-3 py-2">
              {/* LABEL */}
              <div className="flex items-center gap-1.5 text-[11px] font-medium opacity-75">
                <Reply size={11} />
                <span>Replying to</span>
              </div>

              {/* CONTENT */}
              <p
                className={`mt-1 text-xs leading-relaxed opacity-90 line-clamp-2 wrap-break-word`}
              >
                {truncateText(repliedContext)}
              </p>
            </div>
          </div>
        )}

        {/* MAIN MESSAGE */}
        <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
          <p className={`text-sm w-fit leading-relaxed break-all rounded-2xl`}>
            {msg?.body?.text}
          </p>
        </div>
      </div>

      {/* USER AVATAR */}
      {!isBot && (
        <div
          className="size-6 rounded-full flex items-center justify-center shrink-0 shadow-md"
          style={{
            backgroundColor: theme?.backgroundColor,
          }}
        >
          <User size={13} color={theme?.color} />
        </div>
      )}
    </div>
  );
};

export default TextMessage;

// import { TMessage } from "@/types/message.type";
// import { Bot, Reply, User } from "lucide-react";

// type TTextMessageProps = {
//   message: TMessage;
//   wrapperClass: string;
//   commonClass: string;
//   theme?: {
//     backgroundColor?: string;
//     color?: string;
//   };
//   isBot?: boolean;
// };

// const truncateText = (text: string, limit = 100) => {
//   if (text.length <= limit) return text;
//   return `${text.slice(0, limit)}...`;
// };

// const TextMessage = ({
//   wrapperClass,
//   commonClass,
//   message,
//   theme,
//   isBot,
// }: TTextMessageProps) => {
//   const msg = message?.type === "text" ? message : null;

//   const repliedContext = message?.context?.message;

//   return (
//     <div className={wrapperClass}>
//       {/* BOT AVATAR */}
//       {isBot && (
//         <div className="size-5 rounded-full flex items-center justify-center shrink-0 shadow-md bg-linear-to-br from-slate-500 to-indigo-800">
//           <Bot size={12} color="#fff" />
//         </div>
//       )}

//       <div
//         className={`${commonClass} space-y-2`}
//         style={{
//           backgroundColor: theme?.backgroundColor,
//           color: theme?.color,
//         }}
//       >
//         {/* REPLY CONTEXT */}
//         {repliedContext && (
//           <div className="rounded-xl border border-black/10  px-3 py-2 text-xs">
//             <div className="flex items-center gap-1 opacity-60 mb-1">
//               <Reply size={12} />
//               <span>Replying to</span>
//             </div>

//             <p className="line-clamp-2 break-all">
//               {truncateText(repliedContext || "", 120)}
//             </p>
//           </div>
//         )}

//         {/* MAIN MESSAGE */}
//         <p className={`wrap-break-word`}>{msg?.body?.text}</p>
//       </div>

//       {/* USER AVATAR */}
//       {!isBot && (
//         <div
//           className="size-5 rounded-full flex items-center justify-center shrink-0 shadow-md"
//           style={{
//             backgroundColor: theme?.backgroundColor,
//           }}
//         >
//           <User size={12} color={theme?.color} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TextMessage;

// // import { TMessage } from "@/types/message.type";
// // import { Bot, User } from "lucide-react";

// // type TTextMessageProps = {
// //   message: TMessage;
// //   wrapperClass: string;
// //   commonClass: string;
// //   theme?: {
// //     backgroundColor?: string;
// //     color?: string;
// //   };
// //   isBot?: boolean;
// // };

// // const TextMessage = ({
// //   wrapperClass,
// //   commonClass,
// //   message,
// //   theme,
// //   isBot,
// // }: TTextMessageProps) => {
// //   const msg = message?.type === "text" ? message : null;
// //   return (
// //     <div className={wrapperClass}>
// //       {isBot && (
// //         <div className="size-5 rounded-full flex items-center justify-center shrink-0 shadow-md bg-linear-to-br from-slate-500 to-indigo-800">
// //           <Bot size={12} color="#fff" />
// //         </div>
// //       )}

// //       <div>
// //         {message?.context && <p>{message.context?.message}</p>}
// //         <p
// //           className={`${commonClass} wrap-break-word`}
// //           style={{
// //             backgroundColor: theme?.backgroundColor,
// //             color: theme?.color,
// //           }}
// //         >
// //           {msg?.body?.text}
// //         </p>
// //       </div>

// //       {!isBot && (
// //         <div
// //           className="size-8 rounded-full flex items-center justify-center shrink-0 shadow-md"
// //           style={{
// //             backgroundColor: theme?.backgroundColor,
// //           }}
// //         >
// //           <User className="size-4" color={theme?.color} />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TextMessage;

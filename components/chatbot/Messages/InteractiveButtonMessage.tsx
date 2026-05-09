import { TMessage } from "@/types/message.type";
import { Bot, ExternalLink, Reply } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TInteractiveButtonMessage = {
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
const InteractiveButtonMessage = ({
  message,
  wrapperClass,
  commonClass,
  theme,
  isBot,
  onButtonClick,
}: TInteractiveButtonMessage) => {
  const interactive =
    message?.type === "interactive" ? message?.interactive : null;
  if (!interactive) return null;

  const { header, body, footer, action, type } = interactive;

  /** ---------- HEADER ---------- */
  const renderHeader = () => {
    if (!header) return null;

    switch (header.type) {
      case "image":
        return header.image?.link ? (
          <div className="relative md:w-60 w-50 aspect-[4/2.5] overflow-hidden rounded-xl bg-black/5">
            <Image
              src={header.image.link}
              alt="image"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-black/5 h-40" />
        );

      case "video":
        return header.video?.link ? (
          <div className="overflow-hidden rounded-xl bg-black">
            <video controls className="block w-full">
              <source src={header.video.link} />
            </video>
          </div>
        ) : null;

      //   case "document": {
      //     const link = header.document?.link;
      //     const name =
      //       header.document?.filename || filenameFromUrl(link, "Document");
      //     const ext = (name.split(".").pop() || "FILE").toUpperCase().slice(0, 4);
      //     return (
      //       <a
      //         href={link}
      //         target="_blank"
      //         rel="noopener noreferrer"
      //         className="flex items-center gap-3 rounded-xl border border-black/10 bg-white/70 p-3 transition hover:bg-white"
      //       >
      //         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-black/80 text-[10px] font-bold tracking-wide text-white">
      //           {ext}
      //         </div>
      //         <div className="min-w-0 flex-1">
      //           <div className="truncate text-sm font-medium text-gray-900">
      //             {name}
      //           </div>
      //           <div className="text-xs text-gray-500">Tap to open</div>
      //         </div>
      //         <svg
      //           className="h-5 w-5 shrink-0 text-gray-500"
      //           viewBox="0 0 24 24"
      //           fill="none"
      //           stroke="currentColor"
      //           strokeWidth={2}
      //         >
      //           <path
      //             strokeLinecap="round"
      //             strokeLinejoin="round"
      //             d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
      //           />
      //         </svg>
      //       </a>
      //     );
      //   }

      case "text":
      default:
        return header.text ? (
          <div className="text-sm font-semibold text-gray-900">
            {header.text}
          </div>
        ) : null;
    }
  };

  /** ---------- BUTTONS ---------- */
  const renderButtons = () => {
    // if (type !== "button" || !Array.isArray(action?.buttons)) return null;
    const buttons = action && "buttons" in action ? action.buttons : null;
    const urlButton =
      action && "parameters" in action ? action.parameters : null;

    return (
      <div className="flex flex-col divide-y divide-black/10">
        {buttons &&
          buttons?.length > 0 &&
          buttons.map((b, i: number) => {
            const reply = b.type === "reply" ? b.reply : null;
            if (!reply) return null;
            return (
              <button
                key={reply.id || i}
                type="button"
                onClick={() =>
                  onButtonClick?.({
                    id: reply.id,
                    title: reply.title,
                    messageId: message.id,
                  })
                }
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-sky-600 transition  hover:bg-sky-100 cursor-pointer"
              >
                <Reply />
                {reply.title}
              </button>
            );
          })}

        {urlButton && (
          <Link
            className="flex items-center justify-center gap-1 px-3 py-2.5 text-sm font-medium text-sky-600 transition  hover:bg-sky-100 cursor-pointer"
            href={urlButton?.url}
            target="_blank"
          >
            <ExternalLink size={18} /> {urlButton?.display_text}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className={wrapperClass}>
      {isBot && (
        <div className="size-5 rounded-full flex items-center justify-center shrink-0 shadow-md bg-linear-to-br from-slate-500 to-indigo-800">
          <Bot size={12} color="#fff" />
        </div>
      )}

      <div
        className={`${commonClass} p-0!`}
        style={{
          backgroundColor: theme?.backgroundColor,
          color: theme?.color,
        }}
      >
        {/* Header */}
        {header && (
          <div className="p-2 overflow-x-hidden">{renderHeader()}</div>
        )}

        {/* Body + footer */}
        {(body?.text || footer?.text) && (
          <div className="space-y-1 px-3 pb-2 pt-1">
            {body?.text && (
              <pre className="whitespace-pre-wrap leading-snug  font-medium text-sm">
                {body.text}
              </pre>
            )}

            {footer?.text && (
              <p className="text-xs text-gray-400 border-t border-gray-200 mt-4 pt-2">
                {footer.text}
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        {renderButtons()}
      </div>
    </div>
  );
};

export default InteractiveButtonMessage;

import { TMessage } from "@/types/message.type";
import { getDocumentMeta } from "@/utils/getDocumentMeta";
import { Bot, Download, ExternalLink, Reply } from "lucide-react";
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
    message?.type === "interactive" && message?.interactive?.type === "button"
      ? message?.interactive
      : null;

  if (!interactive) return null;

  const { header, body, footer, action } = interactive;

  /** ---------- HEADER ---------- */
  const renderHeader = () => {
    if (!header) return null;

    switch (header?.type) {
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

      case "document": {
        const doc = getDocumentMeta(header?.document?.link || "");
        const Icon = doc?.icon;

        const fileName = decodeURIComponent(
          header?.document?.link?.split("/").pop() || "Document",
        );

        return (
          <div className="rounded-xl flex flex-col items-center justify-center gap-3 border p-2 bg-gray-100">
            <div
              style={{
                backgroundColor: doc?.badgeBg || "#ffffff",
                color: doc?.badgeText || "#000000",
              }}
              className="size-16 rounded-2xl flex items-center justify-center shadow-sm"
            >
              {Icon && <Icon className="size-5" />}
            </div>

            <div className="text-center space-y-1 px-4">
              <p className="text-sm font-medium">{doc?.label || "Document"}</p>

              <p className="text-xs break-all max-w-52 text-gray-600">
                {fileName}
              </p>
            </div>

            <a download href={header?.document?.link} className="shrink-0">
              <Download className="size-5 text-blue-500" />
            </a>
          </div>
        );
      }

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
                    messageId: message.messageId,
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

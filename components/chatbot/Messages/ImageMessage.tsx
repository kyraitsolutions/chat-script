import Image from "next/image";
import React from "react";
import { TMessage } from "@/types/message.type";
import { Bot, User } from "lucide-react";

interface ImageMessageProps {
  message: TMessage;
  wrapperClass?: string;
  commonClass?: string;
  isBot?: boolean;
  theme?: {
    backgroundColor?: string;
    color?: string;
  };
}

const ImageMessage: React.FC<ImageMessageProps> = ({
  message,
  wrapperClass = "",
  commonClass = "",
  theme,
  isBot,
}) => {
  const media = message?.type === "image" ? message?.media : null;

  const imageLink = media?.image?.link;
  const caption = media?.image?.caption;

  if (!imageLink) return null;

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
        className={`${commonClass} overflow-hidden p-2!`}
        style={{
          backgroundColor: theme?.backgroundColor,
          color: theme?.color,
        }}
      >
        <div className="space-y-2 w-full">
          {/* IMAGE */}
          <div className="relative md:w-64 w-56 aspect-[4/2.5] rounded-2xl">
            <Image
              src={imageLink}
              alt={caption || "image"}
              fill
              className="object-cover rounded-2xl"
              sizes="(max-width: 640px) 280px, 320px"
            />
          </div>

          {/* CAPTION */}
          {caption && (
            <p className="text-sm leading-relaxed break-all px-1">{caption}</p>
          )}
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

export default ImageMessage;

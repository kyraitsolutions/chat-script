import React from "react";
import { TMessage } from "@/types/message.type";
import { Bot, Play, User } from "lucide-react";

interface VideoMessageProps {
  message: TMessage;
  wrapperClass?: string;
  commonClass?: string;
  isBot?: boolean;
  theme?: {
    backgroundColor?: string;
    color?: string;
  };
}

const VideoMessage: React.FC<VideoMessageProps> = ({
  message,
  wrapperClass = "",
  commonClass = "",
  theme,
  isBot,
}) => {
  console.log("message", message);
  const videoLink =
    message?.type === "video" ? message?.media?.video?.link : null;

  if (!videoLink) return null;

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
        <div className="space-y-2">
          {/* VIDEO */}
          <div className="relative overflow-hidden rounded-xl bg-black">
            <video controls muted playsInline src={videoLink}>
              Your browser does not support video playback.
            </video>

            {/* Optional overlay icon */}
            {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="bg-black/40 rounded-full p-3 backdrop-blur-sm">
                <Play className="fill-white text-white size-5" />
              </div>
            </div> */}
          </div>
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

export default VideoMessage;

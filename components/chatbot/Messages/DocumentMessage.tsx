import { TMessage } from "@/types/message.type";
import { getDocumentMeta } from "@/utils/getDocumentMeta";
import {
  File,
  FileSpreadsheet,
  FileText,
  FileArchive,
  Presentation,
  Download,
  Bot,
  User,
} from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
import { bg } from "zod/locales";

type TDocumentMessageProps = {
  message: TMessage;
  wrapperClass: string;
  commonClass: string;
  theme?: {
    backgroundColor?: string;
    color?: string;
  };
  isBot?: boolean;
};

const getFileName = (url?: string) => {
  if (!url) return "document";

  try {
    return decodeURIComponent(url.split("/").pop() || "document");
  } catch {
    return "document";
  }
};

const DocumentMessage = ({
  message,
  wrapperClass,
  commonClass,
  theme,
  isBot,
}: TDocumentMessageProps) => {
  if (message.type !== "document") return null;

  const documentLink = message.media?.document?.link;

  const fileName = getFileName(documentLink);
  const doc = getDocumentMeta(documentLink || "");
  const icon = doc && doc.icon;

  return (
    <div className={wrapperClass}>
      {/* BOT AVATAR */}
      {isBot && (
        <div className="size-5 rounded-full flex items-center justify-center shrink-0 shadow-md bg-linear-to-br from-slate-500 to-indigo-800">
          <Bot size={13} color="#fff" />
        </div>
      )}
      {/* DOCUMENT CARD */}
      <div className={commonClass}>
        <a
          href={documentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
        >
          llll
          {/* ICON */}
          <div
            style={{
              color: doc.iconColor,
            }}
          >
            {icon && <doc.icon className="size-8" />}
          </div>
          {/* INFO */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 wrap-break-word">
              {fileName}
            </p>

            {/* <p className="text-xs text-gray-500 uppercase mt-1">
            {fileType} document
          </p> */}
          </div>
          {/* DOWNLOAD */}
          <div className="shrink-0">
            <Download className="size-5 text-gray-500" />
          </div>
        </a>
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

export default DocumentMessage;

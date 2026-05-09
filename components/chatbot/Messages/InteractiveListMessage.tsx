"use client";
import { TMessage } from "@/types/message.type";
import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type TInteractiveListMessage = {
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
    messageId,
  }: {
    id: string;
    title: string;
    messageId: string;
  }) => void;
};

const InteractiveListMessage = ({
  message,
  wrapperClass,
  commonClass,
  theme,
  onButtonClick,
}: TInteractiveListMessage) => {
  const [open, setOpen] = useState(false);

  const interactive =
    message.type === "interactive" ? message.interactive : null;

  const sections = useMemo(() => {
    if (interactive?.type !== "list") return [];
    return interactive.action.sections || [];
  }, [interactive]);

  if (!interactive || interactive.type !== "list") return null;

  return (
    <div className={wrapperClass}>
      <div
        className={commonClass}
        style={{
          backgroundColor: theme?.backgroundColor,
          color: theme?.color,
        }}
      >
        {/* HEADER */}
        {interactive.header?.type === "text" && interactive.header?.text && (
          <div className="mb-2 border-b border-black/10 pb-2">
            <p className="font-semibold text-sm">{interactive.header.text}</p>
          </div>
        )}

        {/* BODY */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{interactive.body.text}</p>

          {/* OPEN BUTTON */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="w-full flex items-center justify-between rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5 transition"
          >
            <span>{interactive.action.button}</span>

            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* LIST */}
          {open && (
            <div className="space-y-4 pt-2">
              {sections.map((section) => (
                <div key={section.title} className="space-y-2">
                  {/* SECTION TITLE */}
                  <p className="text-xs font-semibold uppercase opacity-60">
                    {section.title}
                  </p>

                  {/* ROWS */}
                  <div className="space-y-2">
                    {section.rows.map((row) => (
                      <button
                        key={row.id}
                        type="button"
                        onClick={() =>
                          onButtonClick?.({
                            id: row.id,
                            title: row.title,
                            messageId: message.id,
                          })
                        }
                        className="w-full rounded-xl border border-black/10 p-3 text-left hover:bg-black/5 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-sm">{row.title}</p>

                            {row.description && (
                              <p className="text-xs opacity-70 mt-1">
                                {row.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {interactive.footer?.text && (
          <div className="mt-3 border-t border-black/10 pt-2">
            <p className="text-[11px] opacity-60">{interactive.footer.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveListMessage;

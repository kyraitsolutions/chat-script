import React from "react";
import type { CalendarMode } from "../types";
import { FaCalendarDays } from "react-icons/fa6";
import { BiCloset } from "react-icons/bi";
import { X } from "lucide-react";

interface TriggerProps {
  label: string;
  hasValue: boolean;
  mode: CalendarMode;
  disabled: boolean;
  onClick: () => void;
  onClear: () => void;
}

export function Trigger({
  label,
  hasValue,
  mode,
  disabled,
  onClick,
  onClear,
}: TriggerProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3.5 py-1 text-sm text-gray-700 shadow-sm transition-colors hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60 w-full cursor-pointer"
    >
      <FaCalendarDays size={16} className="shrink-0 text-gray-500" />
      <span className={hasValue ? "" : "text-gray-400"}>{label}</span>
      {hasValue && mode === "range" && (
        <X
          size={14}
          className="ml-1 shrink-0 text-gray-400 transition-colors hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        />
      )}
    </button>
  );
}

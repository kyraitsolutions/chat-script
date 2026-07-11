import React from "react";
import type { CalendarMode } from "../types";

interface CalendarPanelHeaderProps {
  mode: CalendarMode;
  label: string;
  onClear: () => void;
  onCancel: () => void;
  onApply: () => void;
  canClear: boolean;
}

export function CalendarPanelHeader({
  mode,
  label,
  onClear,
  onCancel,
  onApply,
  canClear,
}: CalendarPanelHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4">
      <div className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700">
        {label}
      </div>

      {mode === "range" && canClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Clear filters
        </button>
      )}

      <div className="ml-auto flex items-center gap-5">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onApply}
          className="rounded-lg bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

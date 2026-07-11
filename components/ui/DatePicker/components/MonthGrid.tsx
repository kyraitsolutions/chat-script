import React, { useMemo } from "react";
import type { CalendarMode } from "../types";

import {
  buildMonthCells,
  isAfterDay,
  isBeforeDay,
  isSameDay,
} from "../utils/date";
import { WEEKDAYS_MON, WEEKDAYS_SUN } from "../constants/constants";

interface MonthGridProps {
  year: number;
  month: number;
  weekStartsOn: 0 | 1;
  mode: CalendarMode;
  from: Date | null;
  to: Date | null;
  hoverDate: Date | null;
  onHover: (d: Date | null) => void;
  onSelect: (d: Date) => void;
  isDisabled: (d: Date) => boolean;
}

export function MonthGrid({
  year,
  month,
  weekStartsOn,
  mode,
  from,
  to,
  hoverDate,
  onHover,
  onSelect,
  isDisabled,
}: MonthGridProps) {
  const cells = useMemo(
    () => buildMonthCells(year, month, weekStartsOn),
    [year, month, weekStartsOn],
  );
  const labels = weekStartsOn === 1 ? WEEKDAYS_MON : WEEKDAYS_SUN;

  const previewTo =
    mode === "range" && from && !to && hoverDate ? hoverDate : to;
  let rangeStart = from;
  let rangeEnd = previewTo;
  if (from && previewTo && isAfterDay(from, previewTo)) {
    rangeStart = previewTo;
    rangeEnd = from;
  }

  return (
    <div className="w-[260px] select-none" onMouseLeave={() => onHover(null)}>
      <div className="mb-2 grid grid-cols-7">
        {labels.map((label, i) => (
          <div
            key={i}
            className="flex h-8 items-center justify-center text-xs font-semibold text-gray-500"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} className="h-9 w-[37px]" />;

          const disabled = isDisabled(date);
          const isBoundary =
            mode === "range"
              ? isSameDay(date, rangeStart) || isSameDay(date, rangeEnd)
              : isSameDay(date, from);
          const inRange =
            mode === "range" && rangeStart && rangeEnd && !isBoundary
              ? isAfterDay(date, rangeStart) && isBeforeDay(date, rangeEnd)
              : false;
          const isMultiDayRange = !!(
            rangeStart &&
            rangeEnd &&
            !isSameDay(rangeStart, rangeEnd)
          );
          const showStripBg =
            mode === "range" && isMultiDayRange && (inRange || isBoundary);

          return (
            <div
              key={i}
              className={`flex h-9 w-[37px] items-center justify-center ${showStripBg ? "bg-blue-50" : ""}`}
              onMouseEnter={() =>
                !disabled && mode === "range" && onHover(date)
              }
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onSelect(date)}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
                  disabled
                    ? "cursor-not-allowed text-gray-300"
                    : isBoundary
                      ? "bg-blue-600 font-medium text-white"
                      : "cursor-pointer text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

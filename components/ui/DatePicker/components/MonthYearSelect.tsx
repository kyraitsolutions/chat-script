import React, { useMemo } from "react";
import { BiChevronDown, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { MONTH_NAMES } from "../constants/constants";

interface MonthYearSelectProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export function MonthYearSelect({
  year,
  month,
  onChange,
}: MonthYearSelectProps) {
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const list: number[] = [];
    for (let y = current - 100; y <= current + 10; y++) list.push(y);
    return list;
  }, []);

  const goToMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    onChange(d.getFullYear(), d.getMonth());
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="Previous month"
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <BiChevronLeft size={18} />
        </button>

        <span className="select-none text-sm font-semibold text-gray-800">
          {MONTH_NAMES[month]} {year}
        </span>

        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label="Next month"
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <BiChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <select
            value={month}
            onChange={(e) => onChange(year, Number(e.target.value))}
            aria-label="Month"
            className="cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-gray-800 outline-none transition-colors hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            {MONTH_NAMES.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
          <BiChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="relative">
          <select
            value={year}
            onChange={(e) => onChange(Number(e.target.value), month)}
            aria-label="Year"
            className="cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-gray-800 outline-none transition-colors hover:border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <BiChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}

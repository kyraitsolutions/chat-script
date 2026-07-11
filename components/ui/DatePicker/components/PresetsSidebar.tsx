import React from "react";
import type { DatePreset } from "../types";
import { BiChevronsRight } from "react-icons/bi";

interface PresetsSidebarProps {
  presets: DatePreset[];
  onSelect: (preset: DatePreset) => void;
  activeLabel?: string | null;
}

export function PresetsSidebar({
  presets,
  onSelect,
  activeLabel,
}: PresetsSidebarProps) {
  return (
    <div className="w-40 shrink-0 border-r border-gray-100 pr-5">
      <div className="mb-4 flex items-center gap-1.5 text-[15px] font-semibold text-gray-900">
        Customised
        <BiChevronsRight size={15} className="text-gray-400" />
      </div>
      <ul className="space-y-4">
        {presets.map((preset) => (
          <li key={preset.label}>
            <button
              type="button"
              onClick={() => onSelect(preset)}
              className={[
                "text-left text-sm transition-colors",
                activeLabel === preset.label
                  ? "font-medium text-blue-600"
                  : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
            >
              {preset.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

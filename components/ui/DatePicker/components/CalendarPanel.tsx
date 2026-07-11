import React from "react";
import type { CalendarMode, DatePreset, DateRange, MonthView } from "../types";
import { MonthYearSelect } from "./MonthYearSelect";
import { MonthGrid } from "./MonthGrid";
import { PresetsSidebar } from "./PresetsSidebar";
import { CalendarPanelHeader } from "./CalendarPanelHeader";

interface CalendarPanelProps {
  mode: CalendarMode;
  columns: 1 | 2;
  showPresets: boolean;
  showFooter: boolean;
  presets: DatePreset[];
  weekStartsOn: 0 | 1;

  draft: DateRange;
  draftLabel: string;
  hoverDate: Date | null;

  leftView: MonthView;
  rightView: MonthView;
  onLeftViewChange: (view: MonthView) => void;
  onRightViewChange: (view: MonthView) => void;

  onHover: (d: Date | null) => void;
  onSelectDate: (d: Date) => void;
  onSelectPreset: (preset: DatePreset) => void;
  onClear: () => void;
  onCancel: () => void;
  onApply: () => void;

  isDisabled: (d: Date) => boolean;
  panelClassName?: string;
}

export function CalendarPanel({
  mode,
  columns,
  showPresets,
  showFooter,
  presets,
  weekStartsOn,
  draft,
  draftLabel,
  hoverDate,
  leftView,
  rightView,
  onLeftViewChange,
  onRightViewChange,
  onHover,
  onSelectDate,
  onSelectPreset,
  onClear,
  onCancel,
  onApply,
  isDisabled,
  panelClassName = "",
}: CalendarPanelProps) {
  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-2xl ${panelClassName}`}
    >
      {showFooter && (
        <CalendarPanelHeader
          mode={mode}
          label={draftLabel}
          onClear={onClear}
          onCancel={onCancel}
          onApply={onApply}
          canClear={!!(draft.from || draft.to)}
        />
      )}

      <div className="flex gap-6">
        {showPresets && mode === "range" && (
          <PresetsSidebar presets={presets} onSelect={onSelectPreset} />
        )}

        <div className="flex gap-10">
          <div>
            {columns === 2 && (
              <div className="mb-3 text-sm font-semibold text-gray-900">
                From
              </div>
            )}
            <MonthYearSelect
              year={leftView.year}
              month={leftView.month}
              onChange={(year, month) => onLeftViewChange({ year, month })}
            />
            <div className="mt-4">
              <MonthGrid
                year={leftView.year}
                month={leftView.month}
                weekStartsOn={weekStartsOn}
                mode={mode}
                from={draft.from}
                to={draft.to}
                hoverDate={hoverDate}
                onHover={onHover}
                onSelect={onSelectDate}
                isDisabled={isDisabled}
              />
            </div>
          </div>

          {columns === 2 && (
            <div>
              <div className="mb-3 text-sm font-semibold text-gray-900">To</div>
              <MonthYearSelect
                year={rightView.year}
                month={rightView.month}
                onChange={(year, month) => onRightViewChange({ year, month })}
              />
              <div className="mt-4">
                <MonthGrid
                  year={rightView.year}
                  month={rightView.month}
                  weekStartsOn={weekStartsOn}
                  mode={mode}
                  from={draft.from}
                  to={draft.to}
                  hoverDate={hoverDate}
                  onHover={onHover}
                  onSelect={onSelectDate}
                  isDisabled={isDisabled}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

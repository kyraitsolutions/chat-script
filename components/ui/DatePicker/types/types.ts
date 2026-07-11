export type DateRange = { from: Date | null; to: Date | null };

export type DatePreset = {
  label: string;
  getRange: () => DateRange;
};

export type CalendarMode = "single" | "range";

export interface MonthView {
  year: number;
  month: number;
}

export interface DatePickerBaseProps {
  /** 1 = single calendar, 2 = "From / To" calendars side by side */
  columns?: 1 | 2;
  /** Earliest selectable date */
  minDate?: Date;
  /** Latest selectable date */
  maxDate?: Date;
  /** Disable every date before today */
  disablePast?: boolean;
  /** Disable every date after today */
  disableFuture?: boolean;
  /** Show the "Customised" quick-range sidebar (range mode only) */
  showPresets?: boolean;
  /** Override the default preset list */
  presets?: DatePreset[];
  /**
   * Render the calendar directly in the page flow (no trigger button / popover).
   * Use this for embedding inside a chatbot, a form, a sidebar, etc.
   */
  inline?: boolean;
  /** Show the header bar with Clear filters / Cancel / Apply. Selections only commit on "Apply". */
  showFooter?: boolean;
  /** Popover alignment relative to the trigger */
  align?: "left" | "right";
  /** Placeholder text for the trigger when nothing is selected */
  placeholder?: string;
  /** ClassName for the outer wrapper (controls width/alignment in your layout) */
  className?: string;
  /** ClassName for the dropdown/inline panel itself */
  panelClassName?: string;
  weekStartsOn?: 0 | 1;
  /** Disable the whole component */
  disabled?: boolean;
  /** Called when the user clicks "Apply" (only relevant when showFooter is true) */
  onApply?: () => void;
  /** Called when the user clicks "Cancel" (only relevant when showFooter is true) */
  onCancel?: () => void;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: "single";
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: "range";
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

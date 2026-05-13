import type { TDatePickerProps } from "../DatePicker";
import type { TDatePickerState } from "../hooks/useDatePickerState";
import { DayCell } from "./DayCell";

type TCalendarGridProps = {
  days: Date[];
  state: TDatePickerState;
  props: TDatePickerProps;
};

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export const CalendarGrid: React.FC<TCalendarGridProps> = ({
  days,
  state,
  props,
}) => {
  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-7 gap-y-2 gap-x-1.5">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="py-2 w-full rounded-xl flex items-center justify-center bg-slate-600 text-white text-xs text-center font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 gap-x-1.5">
        {days.map((day, i) => (
          <DayCell key={i} day={day} state={state} props={props} />
        ))}
      </div>
    </div>
  );
};

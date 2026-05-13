import type { TDatePickerProps } from "../DatePicker";
import type { TDatePickerState } from "../hooks/useDatePickerState";
import { addMonths, getMonthDays } from "../utils/utils";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./Header";

type Props = {
  offset: number;
  state: TDatePickerState;
  props: TDatePickerProps;
};

export const Calendar: React.FC<Props> = ({ offset, state, props }) => {
  const month = addMonths(state.currentMonth, offset);
  const days = getMonthDays(month);

  return (
    <div className="border border-slate-200 rounded-xl w-full px-2 py-4 shadow-sm">
      <CalendarHeader month={month} state={state} />
      <CalendarGrid days={days} state={state} props={props} />
    </div>
  );
};

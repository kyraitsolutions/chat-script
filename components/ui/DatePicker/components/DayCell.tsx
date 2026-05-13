import type { TDatePickerProps } from "../DatePicker";
import type { TDatePickerState } from "../hooks/useDatePickerState";
import { isFuture, isPast, isSameDay } from "../utils/utils";

type TDayCellProps = {
  day: Date;
  state: TDatePickerState;
  props: TDatePickerProps;
};

export const DayCell: React.FC<TDayCellProps> = ({ day, state, props }) => {
  const isSelected = isSameDay(day, state?.selectedDate as Date);

  const inRange =
    state.range.start &&
    state.range.end &&
    day >= state.range.start &&
    day <= state.range.end;

  const inHoverRange =
    state.range.start &&
    !state.range.end &&
    state.hoverDate &&
    day >= state.range.start &&
    day <= state.hoverDate;

  const disabled =
    (props.disablePast && isPast(day)) ||
    (props.disableFuture && isFuture(day));

  return (
    <button
      disabled={disabled}
      onClick={() => state.selectDate(day)}
      onMouseEnter={() => state.setHoverDate(day)}
      className={`p-2 text-xs cursor-pointer bg-gray-100 rounded-full
        ${isSelected ? "bg-blue-600 text-white" : ""}
        ${inRange ? "bg-blue-500" : ""}
        ${inHoverRange ? "bg-blue-500" : ""}
        ${disabled ? "opacity-30" : "hover:bg-gray-200"}
      `}
    >
      {day.getDate()}
    </button>
  );
};

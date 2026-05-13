import type { TDatePickerProps } from "../DatePicker";
import type { TDatePickerState } from "../hooks/useDatePickerState";
import { CalendarContainer } from "./CalendarContainer";

type TDatePickerPopoverProps = {
  state: TDatePickerState;
  props: TDatePickerProps;
};

export const DatePickerPopover: React.FC<TDatePickerPopoverProps> = ({
  state,
  props,
}) => {
  if (props.range && props.dualCalendar && state.open)
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/40 backdrop-blur-xs z-50">
        <CalendarContainer state={state} props={props} />
      </div>
    );

  return (
    state.open && (
      <div className="absolute z-50 -top-102  flex gap-4  w-full bg-white">
        <CalendarContainer state={state} props={props} />

        {/* {props.showTime && (
        <TimePicker
          time={state.time}
          setTime={state.setTime}
          format={props.timeFormat || "12h"}
        />
      )} */}
      </div>
    )
  );
};

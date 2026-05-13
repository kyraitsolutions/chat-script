import { DatePickerInput } from "./components/DatePickerInput";
import { DatePickerPopover } from "./components/DatePickerPopover";
import { useDatePickerState } from "./hooks/useDatePickerState";

export type TDatePickerProps = {
  value?: Date | { start: Date; end: Date };
  onChange: (value: any) => void;

  range?: boolean;
  dualCalendar?: boolean;

  showTime?: boolean;
  timeFormat?: "12h" | "24h";

  disablePast?: boolean;
  disableFuture?: boolean;
};

export const DatePicker: React.FC<TDatePickerProps> = (props) => {
  const state = useDatePickerState(props);

  return (
    <div className="relative inline-block">
      <DatePickerInput state={state} />
      <DatePickerPopover state={state} props={props} />
    </div>
  );
};

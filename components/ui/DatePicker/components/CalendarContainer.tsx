import { X } from "lucide-react";

import type { TDatePickerProps } from "../DatePicker";
import type { TDatePickerState } from "../hooks/useDatePickerState";
import { Calendar } from "./Calendar";
import { Button } from "../../button";

type Props = {
  state: TDatePickerState;
  props: TDatePickerProps;
};

export const CalendarContainer: React.FC<Props> = ({ state, props }) => {
  if (props.range && props.dualCalendar) {
    return (
      <div className="w-fit bg-white flex flex-col justify-center p-4 rounded-xl">
        <div className="flex justify-end mb-3">
          <Button
            onClick={() => state.setOpen && state.setOpen(false)}
            className="bg-slate-700 rounded-full size-6 flex items-center justify-center"
          >
            <X />
          </Button>
        </div>

        <div className="flex gap-4 max-w-2xl w-full bg-orange-0 p-2">
          <Calendar offset={0} state={state} props={props} />
          <Calendar offset={1} state={state} props={props} />
        </div>

        <div className="flex justify-end">
          <Button disabled={!state.range.start || !state.range.end}>
            Apply
          </Button>
        </div>
      </div>
    );
  }

  return <Calendar offset={0} state={state} props={props} />;
};

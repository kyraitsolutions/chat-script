import { CalendarDays } from "lucide-react";
import type { TDatePickerState } from "../hooks/useDatePickerState";

type TDatePickerInputProps = {
  state: TDatePickerState;
  placeholder?: string;
};

export const DatePickerInput: React.FC<TDatePickerInputProps> = ({
  state,
  placeholder,
}) => {
  // ✅ format date (clean)
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getValue = () => {
    // single date
    if (state.selectedDate) {
      return formatDate(state.selectedDate);
    }

    // range
    if (state.range.start && state.range.end) {
      return `${formatDate(state.range.start)} - ${formatDate(state.range.end)}`;
    }

    return "";
  };

  const displayValue = getValue() || placeholder || formatDate(new Date());

  return (
    <div
      onClick={() => state.setOpen && state.setOpen(!state.open)}
      className={`flex items-center gap-2 
         px-3 py-1 rounded-lg min-w-72 
        cursor-pointer
        ${state.open ? "ring" : "ring-black/10"}
      `}
    >
      {/* ICON */}
      {/* <CalendarDays size={18} className="text-gray-500" /> */}

      {/* TEXT */}
      <span
        className={`text-sm ${getValue() ? "text-black" : "text-gray-400"}`}
      >
        {displayValue}
      </span>
    </div>
  );
};

// import type { TDatePickerState } from "../hooks/useDatePickerState";

// type TDatePickerInputProps = {
//   state: TDatePickerState;
// };

// export const DatePickerInput: React.FC<TDatePickerInputProps> = ({ state }) => {
//   const value = state.selectedDate
//     ? state.selectedDate.toDateString()
//     : state.range.start && state.range.end
//       ? `${state.range.start.toDateString()} - ${state.range.end.toDateString()}`
//       : "";

//   return (
//     <input
//       readOnly
//       value={value}
//       className="border px-3 py-2 rounded-lg w-64"
//     />
//   );
// };

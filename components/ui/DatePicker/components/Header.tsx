import { ArrowLeft, ArrowRight } from "lucide-react";
import type { TDatePickerState } from "../hooks/useDatePickerState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../select";

type TCalendarHeaderProps = {
  month: Date;
  state: TDatePickerState;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const CalendarHeader: React.FC<TCalendarHeaderProps> = ({
  month,
  state,
}) => {
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 100 }, (_, i) => currentYear - 100 + i);

  const handleMonthChange = (value: number) => {
    const newDate = new Date(month);
    newDate.setMonth(value);
    state.setCurrentMonth(newDate);
  };

  const handleYearChange = (value: number) => {
    const newDate = new Date(month);
    newDate.setFullYear(value);
    state.setCurrentMonth(newDate);
  };

  const handlePrev = () => {
    const newDate = new Date(month);
    newDate.setMonth(newDate.getMonth() - 1);
    state.setCurrentMonth(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(month);
    newDate.setMonth(newDate.getMonth() + 1);
    state.setCurrentMonth(newDate);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {/* LEFT ARROW */}
        <button
          onClick={handlePrev}
          className="size-6 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 hover:text-slate-800 duration-300 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>

        {/* MONTH */}
        <span className="text-sm font-medium">
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </span>

        {/* RIGHT ARROW */}
        <button
          onClick={handleNext}
          className="size-6 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 hover:text-slate-800 duration-300 cursor-pointer"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex gap-2">
        {/* MONTH */}
        <Select
          value={month.getMonth().toString()}
          onValueChange={(value) => handleMonthChange(parseInt(value))}
        >
          <SelectTrigger className="flex-1 bg-white">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m, i) => (
              <SelectItem key={m} value={i.toString()}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* YEAR */}
        <Select
          value={month.getFullYear().toString()}
          onValueChange={(value) => handleYearChange(parseInt(value))}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import type { TDatePickerProps } from "../DatePicker";

export type TDateRange = {
  start?: Date;
  end?: Date;
};

export type TTimeState = {
  hour: number;
  minute: number;
  period: "AM" | "PM";
};

export type TDatePickerState = {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;

  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;

  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;

  range: TDateRange;
  setRange: (range: TDateRange) => void;

  hoverDate: Date | null;
  setHoverDate: (date: Date | null) => void;

  time: TTimeState;
  setTime: (time: TTimeState) => void;

  selectDate: (date: Date) => void;
};

export const useDatePickerState = (
  props: TDatePickerProps,
): TDatePickerState => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [range, setRange] = useState<TDateRange>({});

  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const [time, setTime] = useState<TTimeState>({
    hour: 12,
    minute: 0,
    period: "AM",
  });

  const selectDate = (date: Date) => {
    if (!props.range) {
      setSelectedDate(date);
      props.onChange(date);
      return;
    }

    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: undefined });
    } else {
      let start = range.start;
      let end = date;

      if (start > end) [start, end] = [end, start];

      const newRange = { start, end };
      setRange(newRange);
      props.onChange(newRange);
    }
  };

  return {
    currentMonth,
    setCurrentMonth,
    selectedDate,
    setSelectedDate,
    range,
    setRange,
    hoverDate,
    setHoverDate,
    time,
    setTime,
    selectDate,
    open,
    setOpen,
  };
};

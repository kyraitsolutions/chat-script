import { DatePreset } from "../types";
import {
  rangeFromDaysBack,
  rangeFromMonthsBack,
  stripTime,
} from "../utils/date";

export const MONTH_NAMES = [
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

export const WEEKDAYS_SUN = ["S", "M", "T", "W", "T", "F", "S"];
export const WEEKDAYS_MON = ["M", "T", "W", "T", "F", "S", "S"];

export const DEFAULT_PRESETS: DatePreset[] = [
  {
    label: "Today",
    getRange: () => ({
      from: stripTime(new Date()),
      to: stripTime(new Date()),
    }),
  },
  { label: "Last 3 Days", getRange: () => rangeFromDaysBack(2) },
  { label: "Last 7 Days", getRange: () => rangeFromDaysBack(6) },
  { label: "Last 30 Days", getRange: () => rangeFromDaysBack(29) },
  { label: "Last 3 Months", getRange: () => rangeFromMonthsBack(3) },
  { label: "Last 6 Months", getRange: () => rangeFromMonthsBack(6) },
  { label: "Last 1 Year", getRange: () => rangeFromMonthsBack(12) },
];

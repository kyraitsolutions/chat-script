export const isSameDay = (a?: Date, b?: Date) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isPast = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isFuture = (date: Date) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
};

export const addMonths = (date: Date, amount: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
};

export const getMonthDays = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const days: Date[] = [];

  const startDay = start.getDay();

  // previous month padding
  for (let i = 0; i < startDay; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() - (startDay - i));
    days.push(d);
  }

  // current month
  for (let i = 1; i <= end.getDate(); i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }

  // next month padding
  while (days.length < 30) {
    const last = days[days.length - 1];
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    days.push(d);
  }

  return days;
};

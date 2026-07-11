import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  DatePickerProps,
  DatePickerRangeProps,
  DatePickerSingleProps,
  DatePreset,
  DateRange,
  MonthView,
} from "./types/index";
import { DEFAULT_PRESETS } from "./constants/constants";
import {
  addMonths,
  formatDate,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  stripTime,
} from "./utils/date";
import { useOutsideClick } from "./hooks/useOutsideClick";

import { CalendarPanel } from "./components/CalendarPanel";
import { Trigger } from "./components/Trigger";
import { usePopoverPlacement } from "./hooks/usePopoverPlacement";

export function DatePicker(props: DatePickerProps) {
  const {
    columns = 1,
    minDate,
    maxDate,
    disablePast = false,
    disableFuture = false,
    showPresets = false,
    presets = DEFAULT_PRESETS,
    inline = false,
    showFooter = false,
    align = "left",
    placeholder = "Select date",
    className = "",
    panelClassName = "",
    weekStartsOn = 0,
    disabled = false,
    onApply,
    onCancel,
  } = props;

  const mode = props.mode === "range" ? "range" : "single";
  const isControlled = props.value !== undefined;

  const committedFromProp: DateRange = useMemo(() => {
    if (mode === "range") {
      const v = (props as DatePickerRangeProps).value;
      return v ?? { from: null, to: null };
    }
    const v = (props as DatePickerSingleProps).value;
    return { from: v ?? null, to: null };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, props.value]);

  const [committed, setCommitted] = useState<DateRange>(committedFromProp);
  const [draft, setDraft] = useState<DateRange>(committedFromProp);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const today = new Date();

  const [leftView, setLeftView] = useState<MonthView>({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const [rightView, setRightView] = useState<MonthView>(() =>
    addMonths({ year: today.getFullYear(), month: today.getMonth() }, 1),
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Decide whether the panel should drop down or flip above the trigger,
  // based on how much viewport space is actually available.
  const placement = usePopoverPlacement(
    containerRef,
    panelRef,
    open && !inline,
  );

  // Keep internal state synced with a controlled `value` prop.
  useEffect(() => {
    if (isControlled) {
      setCommitted(committedFromProp);
      if (!open) setDraft(committedFromProp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committedFromProp, isControlled]);

  useOutsideClick(containerRef, open && !inline, () => {
    setOpen(false);
    setDraft(committed);
  });

  const isDisabled = useCallback(
    (date: Date) => {
      if (disabled) return true;
      const day = stripTime(date);
      const now = stripTime(new Date());
      if (disablePast && isBeforeDay(day, now)) return true;
      if (disableFuture && isAfterDay(day, now)) return true;
      if (minDate && isBeforeDay(day, stripTime(minDate))) return true;
      if (maxDate && isAfterDay(day, stripTime(maxDate))) return true;
      return false;
    },
    [disabled, disablePast, disableFuture, minDate, maxDate],
  );

  const commit = useCallback(
    (next: DateRange) => {
      if (!isControlled) setCommitted(next);
      if (mode === "range") {
        (props.onChange as ((r: DateRange) => void) | undefined)?.(next);
      } else {
        (props.onChange as ((d: Date | null) => void) | undefined)?.(next.from);
      }
    },
    [isControlled, mode, props.onChange],
  );

  const openPopover = () => {
    if (disabled) return;
    setDraft(committed);
    if (committed.from) {
      setLeftView({
        year: committed.from.getFullYear(),
        month: committed.from.getMonth(),
      });
      const to = committed.to ?? committed.from;
      setRightView(
        addMonths(
          { year: to.getFullYear(), month: to.getMonth() },
          isSameDay(committed.from, to) ? 1 : 0,
        ),
      );
    }
    setOpen(true);
  };

  const handleSelectDate = (date: Date) => {
    if (mode === "single") {
      const next: DateRange = { from: date, to: null };
      setDraft(next);
      if (!showFooter) {
        commit(next);
        setOpen(false);
      }
      return;
    }

    setDraft((prev) => {
      let next: DateRange;
      if (!prev.from || (prev.from && prev.to)) {
        next = { from: date, to: null };
      } else if (isBeforeDay(date, prev.from)) {
        next = { from: date, to: prev.from };
      } else {
        next = { from: prev.from, to: date };
      }

      if (next.from && next.to && !showFooter) {
        commit(next);
        setOpen(false);
      }
      return next;
    });
  };

  const handleSelectPreset = (preset: DatePreset) => {
    const next = preset.getRange();
    setDraft(next);
    if (next.from)
      setLeftView({
        year: next.from.getFullYear(),
        month: next.from.getMonth(),
      });
    if (next.to)
      setRightView({ year: next.to.getFullYear(), month: next.to.getMonth() });
    if (!showFooter) {
      commit(next);
      setOpen(false);
    }
  };

  const handleClear = () => setDraft({ from: null, to: null });

  const handleApply = () => {
    commit(draft);
    onApply?.();
    setOpen(false);
  };

  const handleCancel = () => {
    setDraft(committed);
    onCancel?.();
    setOpen(false);
  };

  const formatRange = (range: DateRange) => {
    if (mode === "range") {
      if (range.from && range.to)
        return `${formatDate(range.from)}   —   ${formatDate(range.to)}`;
      if (range.from) return formatDate(range.from);
      return placeholder;
    }
    return range.from ? formatDate(range.from) : placeholder;
  };

  const committedLabel = formatRange(committed);
  const draftLabel = formatRange(draft);

  const panel = (
    <CalendarPanel
      mode={mode}
      columns={columns}
      showPresets={showPresets}
      showFooter={showFooter}
      presets={presets}
      weekStartsOn={weekStartsOn}
      draft={draft}
      draftLabel={draftLabel}
      hoverDate={hoverDate}
      leftView={leftView}
      rightView={rightView}
      onLeftViewChange={setLeftView}
      onRightViewChange={setRightView}
      onHover={setHoverDate}
      onSelectDate={handleSelectDate}
      onSelectPreset={handleSelectPreset}
      onClear={handleClear}
      onCancel={handleCancel}
      onApply={handleApply}
      isDisabled={isDisabled}
      panelClassName={panelClassName}
    />
  );

  if (inline) {
    return <div className={`inline-block ${className}`}>{panel}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full ${className}`}
    >
      <Trigger
        label={committedLabel}
        hasValue={!!committed.from}
        mode={mode}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPopover())}
        onClear={() => commit({ from: null, to: null })}
      />

      {open && (
        <div
          ref={panelRef}
          className={[
            "absolute z-50",
            align === "right" ? "right-0" : "left-0",
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2",
          ].join(" ")}
        >
          {panel}
        </div>
      )}
    </div>
  );
}

export default DatePicker;

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import type {
//   DatePickerProps,
//   DatePickerRangeProps,
//   DatePickerSingleProps,
//   DatePreset,
//   DateRange,
//   MonthView,
// } from "./types/index";
// import { DEFAULT_PRESETS } from "./constants/constants";
// import {
//   addMonths,
//   formatDate,
//   isAfterDay,
//   isBeforeDay,
//   isSameDay,
//   stripTime,
// } from "./utils/date";
// import { useOutsideClick } from "./hooks/useOutsideClick";
// import { CalendarPanel } from "./components/CalendarPanel";
// import { Trigger } from "./components/Trigger";

// export function DatePicker(props: DatePickerProps) {
//   const {
//     columns = 1,
//     minDate,
//     maxDate,
//     disablePast = false,
//     disableFuture = false,
//     showPresets = false,
//     presets = DEFAULT_PRESETS,
//     inline = false,
//     showFooter = false,
//     align = "left",
//     placeholder = "Select date",
//     className = "",
//     panelClassName = "",
//     weekStartsOn = 0,
//     disabled = false,
//     onApply,
//     onCancel,
//   } = props;

//   const mode = props.mode === "range" ? "range" : "single";
//   const isControlled = props.value !== undefined;

//   const committedFromProp: DateRange = useMemo(() => {
//     if (mode === "range") {
//       const v = (props as DatePickerRangeProps).value;
//       return v ?? { from: null, to: null };
//     }
//     const v = (props as DatePickerSingleProps).value;
//     return { from: v ?? null, to: null };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mode, props.value]);

//   const [committed, setCommitted] = useState<DateRange>(committedFromProp);
//   const [draft, setDraft] = useState<DateRange>(committedFromProp);
//   const [hoverDate, setHoverDate] = useState<Date | null>(null);
//   const [open, setOpen] = useState(false);

//   const today = new Date();

//   const [leftView, setLeftView] = useState<MonthView>({
//     year: today.getFullYear(),
//     month: today.getMonth(),
//   });

//   const [rightView, setRightView] = useState<MonthView>(() =>
//     addMonths({ year: today.getFullYear(), month: today.getMonth() }, 1),
//   );

//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // Keep internal state synced with a controlled `value` prop.
//   useEffect(() => {
//     if (isControlled) {
//       setCommitted(committedFromProp);
//       if (!open) setDraft(committedFromProp);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [committedFromProp, isControlled]);

//   useOutsideClick(containerRef, open && !inline, () => {
//     setOpen(false);
//     setDraft(committed);
//   });

//   const isDisabled = useCallback(
//     (date: Date) => {
//       if (disabled) return true;
//       const day = stripTime(date);
//       const now = stripTime(new Date());
//       if (disablePast && isBeforeDay(day, now)) return true;
//       if (disableFuture && isAfterDay(day, now)) return true;
//       if (minDate && isBeforeDay(day, stripTime(minDate))) return true;
//       if (maxDate && isAfterDay(day, stripTime(maxDate))) return true;
//       return false;
//     },
//     [disabled, disablePast, disableFuture, minDate, maxDate],
//   );

//   const commit = useCallback(
//     (next: DateRange) => {
//       if (!isControlled) setCommitted(next);
//       if (mode === "range") {
//         (props.onChange as ((r: DateRange) => void) | undefined)?.(next);
//       } else {
//         (props.onChange as ((d: Date | null) => void) | undefined)?.(next.from);
//       }
//     },
//     [isControlled, mode, props.onChange],
//   );

//   const openPopover = () => {
//     if (disabled) return;
//     setDraft(committed);
//     if (committed.from) {
//       setLeftView({
//         year: committed.from.getFullYear(),
//         month: committed.from.getMonth(),
//       });
//       const to = committed.to ?? committed.from;
//       setRightView(
//         addMonths(
//           { year: to.getFullYear(), month: to.getMonth() },
//           isSameDay(committed.from, to) ? 1 : 0,
//         ),
//       );
//     }
//     setOpen(true);
//   };

//   const handleSelectDate = (date: Date) => {
//     if (mode === "single") {
//       const next: DateRange = { from: date, to: null };
//       setDraft(next);
//       if (!showFooter) {
//         commit(next);
//         setOpen(false);
//       }
//       return;
//     }

//     setDraft((prev) => {
//       let next: DateRange;
//       if (!prev.from || (prev.from && prev.to)) {
//         next = { from: date, to: null };
//       } else if (isBeforeDay(date, prev.from)) {
//         next = { from: date, to: prev.from };
//       } else {
//         next = { from: prev.from, to: date };
//       }

//       if (next.from && next.to && !showFooter) {
//         commit(next);
//         setOpen(false);
//       }
//       return next;
//     });
//   };

//   const handleSelectPreset = (preset: DatePreset) => {
//     const next = preset.getRange();
//     setDraft(next);
//     if (next.from)
//       setLeftView({
//         year: next.from.getFullYear(),
//         month: next.from.getMonth(),
//       });
//     if (next.to)
//       setRightView({ year: next.to.getFullYear(), month: next.to.getMonth() });
//     if (!showFooter) {
//       commit(next);
//       setOpen(false);
//     }
//   };

//   const handleClear = () => setDraft({ from: null, to: null });

//   const handleApply = () => {
//     commit(draft);
//     onApply?.();
//     setOpen(false);
//   };

//   const handleCancel = () => {
//     setDraft(committed);
//     onCancel?.();
//     setOpen(false);
//   };

//   const formatRange = (range: DateRange) => {
//     if (mode === "range") {
//       if (range.from && range.to)
//         return `${formatDate(range.from)}   —   ${formatDate(range.to)}`;
//       if (range.from) return formatDate(range.from);
//       return placeholder;
//     }
//     return range.from ? formatDate(range.from) : placeholder;
//   };

//   const committedLabel = formatRange(committed);
//   const draftLabel = formatRange(draft);

//   const panel = (
//     <CalendarPanel
//       mode={mode}
//       columns={columns}
//       showPresets={showPresets}
//       showFooter={showFooter}
//       presets={presets}
//       weekStartsOn={weekStartsOn}
//       draft={draft}
//       draftLabel={draftLabel}
//       hoverDate={hoverDate}
//       leftView={leftView}
//       rightView={rightView}
//       onLeftViewChange={setLeftView}
//       onRightViewChange={setRightView}
//       onHover={setHoverDate}
//       onSelectDate={handleSelectDate}
//       onSelectPreset={handleSelectPreset}
//       onClear={handleClear}
//       onCancel={handleCancel}
//       onApply={handleApply}
//       isDisabled={isDisabled}
//       panelClassName={panelClassName}
//     />
//   );

//   if (inline) {
//     return <div className={`inline-block ${className}`}>{panel}</div>;
//   }

//   return (
//     <div
//       ref={containerRef}
//       className={`relative inline-block w-full ${className}`}
//     >
//       <Trigger
//         label={committedLabel}
//         hasValue={!!committed.from}
//         mode={mode}
//         disabled={disabled}
//         onClick={() => (open ? setOpen(false) : openPopover())}
//         onClear={() => commit({ from: null, to: null })}
//       />

//       {open && (
//         <div
//           className={`absolute z-50 ${align === "right" ? "right-0" : "left-0"}`}
//         >
//           {panel}
//         </div>
//       )}
//     </div>
//   );
// }

// export default DatePicker;

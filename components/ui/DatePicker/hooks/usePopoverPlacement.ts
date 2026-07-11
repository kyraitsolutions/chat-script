import { useLayoutEffect, useState, type RefObject } from "react";

export type Placement = "bottom" | "top";

export function usePopoverPlacement(
  triggerRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  active: boolean,
  gap = 8,
) {
  const [placement, setPlacement] = useState<Placement>("bottom");

  useLayoutEffect(() => {
    if (!active) return;

    const recalculate = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger) return;

      const triggerRect = trigger.getBoundingClientRect();
      const panelHeight = panel?.offsetHeight ?? 380; // sensible fallback before first paint
      const spaceBelow = window.innerHeight - triggerRect.bottom - gap;
      const spaceAbove = triggerRect.top - gap;

      if (spaceBelow < panelHeight && spaceAbove > spaceBelow) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    };

    recalculate();

    window.addEventListener("resize", recalculate);
    window.addEventListener("scroll", recalculate, true);
    return () => {
      window.removeEventListener("resize", recalculate);
      window.removeEventListener("scroll", recalculate, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return placement;
}

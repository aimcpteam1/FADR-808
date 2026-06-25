"use client";

import { useCallback, useRef, useState } from "react";

type Orientation = "vertical" | "horizontal";

interface UseFaderOptions {
  orientation?: Orientation;
  /** Initial value, 0–1. Default 0.5. */
  initial?: number;
  onChange?: (value: number) => void;
}

/**
 * Headless 1D drag control — powers both volume faders (vertical) and the
 * crossfader (horizontal). Value is derived from the pointer position over
 * the track element, clamped to 0–1.
 *
 *   vertical:   top = 1, bottom = 0
 *   horizontal: left = 0, right = 1
 */
export function useFader<T extends HTMLElement = HTMLDivElement>({
  orientation = "vertical",
  initial = 0.5,
  onChange,
}: UseFaderOptions = {}) {
  const trackRef = useRef<T | null>(null);
  const [value, setValue] = useState(initial);
  const [isDragging, setIsDragging] = useState(false);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const compute = useCallback(
    (clientX: number, clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const v =
        orientation === "vertical"
          ? 1 - (clientY - r.top) / r.height
          : (clientX - r.left) / r.width;
      const clamped = Math.min(1, Math.max(0, v));
      setValue(clamped);
      onChangeRef.current?.(clamped);
    },
    [orientation]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<T>) => {
      e.preventDefault();
      setIsDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
      compute(e.clientX, e.clientY);
    },
    [compute]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!isDragging) return;
      compute(e.clientX, e.clientY);
    },
    [isDragging, compute]
  );

  const end = useCallback(() => setIsDragging(false), []);

  return {
    trackRef,
    value,
    isDragging,
    setValue,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
    },
  };
}

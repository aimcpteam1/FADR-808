"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface JogWheelState {
  /** Accumulated rotation in degrees (unbounded — can exceed ±360). */
  angle: number;
  /** Current angular velocity in degrees per frame (sign = direction). */
  velocity: number;
  /** Rotation change applied this frame in degrees. */
  delta: number;
}

interface UseJogWheelOptions {
  /** Inertia friction per frame (0–1). Higher = stops faster. Default 0.05. */
  friction?: number;
  /** Velocity (deg/frame) below which the wheel snaps to rest. Default 0.02. */
  restThreshold?: number;
  /**
   * Fired on every rotation step — both active drag and inertia.
   * This is the integration point for sound: a future audio module can
   * scrub / pitch-bend based on `velocity`, or trigger on `angle`.
   */
  onRotate?: (state: JogWheelState) => void;
}

/**
 * Headless jog-wheel controller.
 *
 * Tracks pointer angle around the wheel's center, drives a 1:1 rotation
 * during drag, and applies friction-based inertia on release. Rotation is
 * written straight to the DOM transform (no per-frame React re-render) for
 * smoothness; `isDragging` is the only reactive piece (used for cursor).
 */
export function useJogWheel<T extends HTMLElement = HTMLDivElement>(
  options: UseJogWheelOptions = {}
) {
  const { friction = 0.05, restThreshold = 0.02, onRotate } = options;

  const wheelRef = useRef<T | null>(null);

  const angleRef    = useRef(0);   // accumulated degrees
  const velocityRef = useRef(0);   // deg per frame (smoothed during drag)
  const pointerRef  = useRef<number | null>(null); // last pointer angle (rad)
  const rafRef      = useRef(0);

  const [isDragging, setIsDragging] = useState(false);

  // Keep latest callback without re-binding handlers.
  const onRotateRef = useRef(onRotate);
  useEffect(() => { onRotateRef.current = onRotate; }, [onRotate]);

  // Write rotation to the DOM and notify subscribers.
  const apply = useCallback((delta: number) => {
    angleRef.current += delta;
    const el = wheelRef.current;
    if (el) el.style.transform = `rotate(${angleRef.current}deg)`;
    onRotateRef.current?.({
      angle: angleRef.current,
      velocity: velocityRef.current,
      delta,
    });
  }, []);

  // Pointer angle relative to wheel center, in radians.
  const pointerAngle = useCallback((clientX: number, clientY: number) => {
    const el = wheelRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.atan2(clientY - (r.top + r.height / 2), clientX - (r.left + r.width / 2));
  }, []);

  const stopInertia = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  // Decay velocity each frame until it comes to rest.
  const startInertia = useCallback(() => {
    stopInertia();
    const step = () => {
      velocityRef.current *= 1 - friction;
      if (Math.abs(velocityRef.current) < restThreshold) {
        velocityRef.current = 0;
        rafRef.current = 0;
        return;
      }
      apply(velocityRef.current);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [apply, friction, restThreshold, stopInertia]);

  const onPointerDown = useCallback((e: React.PointerEvent<T>) => {
    e.preventDefault();
    stopInertia();
    velocityRef.current = 0;
    pointerRef.current = pointerAngle(e.clientX, e.clientY);
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, [pointerAngle, stopInertia]);

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (pointerRef.current === null) return;

    const current = pointerAngle(e.clientX, e.clientY);
    // Shortest signed angular difference, normalized to [-PI, PI].
    let d = current - pointerRef.current;
    while (d >  Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    pointerRef.current = current;

    const deltaDeg = d * (180 / Math.PI);
    // Position tracks the pointer 1:1; velocity is smoothed for a natural throw.
    velocityRef.current = velocityRef.current * 0.7 + deltaDeg * 0.3;
    apply(deltaDeg);
  }, [apply, pointerAngle]);

  const endDrag = useCallback(() => {
    if (pointerRef.current === null) return;
    pointerRef.current = null;
    setIsDragging(false);
    startInertia();
  }, [startInertia]);

  // Cleanup any in-flight inertia on unmount.
  useEffect(() => () => stopInertia(), [stopInertia]);

  return {
    wheelRef,
    isDragging,
    /** Spread onto the wheel element. */
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
    /** Imperative read for external systems (e.g. sound). */
    getState: (): JogWheelState => ({
      angle: angleRef.current,
      velocity: velocityRef.current,
      delta: 0,
    }),
  };
}

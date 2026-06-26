"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/constants";
import type { Product } from "@/lib/products";

interface ProductCarouselProps {
  products: Product[];
  /** MCP-selected id — the carousel slides this product to center. */
  selectedId: string;
  /** Fired when the centered (selected) product changes. */
  onCenterChange?: (product: Product) => void;
}

const SPACING = 200; // px between neighbours
const EASE = 0.12; // position → target lerp per frame

/**
 * Cover-Flow style infinite 3D product carousel.
 *
 * Center item is largest/selected; neighbours scale down, tilt, recede and
 * fade. Wheel / drag scrubs with inertia + easing; the wrapped offset gives an
 * endless loop. Setting `selectedId` (e.g. from an MCP recommendation) slides
 * the carousel to that product along the shortest path.
 */
export function ProductCarousel({
  products,
  selectedId,
  onCenterChange,
}: ProductCarouselProps) {
  const n = products.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const position = useRef(0); // fractional center index
  const target = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const lastCenter = useRef(-1);
  const raf = useRef(0);
  const snapTimer = useRef(0);

  const onCenterRef = useRef(onCenterChange);
  onCenterRef.current = onCenterChange;

  // shortest signed offset of index i from the current position, wrapped.
  const wrap = (x: number) => {
    const half = n / 2;
    let o = ((x % n) + n) % n;
    if (o > half) o -= n;
    return o;
  };

  const paint = () => {
    const pos = position.current;
    for (let i = 0; i < n; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const offset = wrap(i - pos);
      const abs = Math.abs(offset);

      const tx = Math.sign(offset) * Math.pow(abs, 0.9) * SPACING;
      const tz = -abs * 140;
      const ry = Math.max(-55, Math.min(55, -offset * 26));
      const scale = Math.max(0.5, 1 - abs * 0.16);
      const opacity = Math.max(0, 1 - abs * 0.26);

      el.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(1000 - Math.round(abs * 10));
      el.style.visibility = abs > 5 ? "hidden" : "visible";
    }

    const ci = ((Math.round(pos) % n) + n) % n;
    if (ci !== lastCenter.current) {
      lastCenter.current = ci;
      onCenterRef.current?.(products[ci]);
    }
  };

  // Animation loop.
  useEffect(() => {
    const tick = () => {
      if (!dragging.current) {
        position.current += (target.current - position.current) * EASE;
        if (Math.abs(target.current - position.current) < 0.0008) {
          position.current = target.current;
        }
      }
      paint();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel (non-passive so we can prevent page scroll while scrubbing).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      target.current += d * 0.006;
      window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        target.current = Math.round(target.current);
      }, 130);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Slide to the MCP-selected product (shortest path).
  useEffect(() => {
    const idx = products.findIndex((p) => p.id === selectedId);
    if (idx < 0) return;
    const cur = Math.round(position.current);
    const curIdx = ((cur % n) + n) % n;
    let delta = (((idx - curIdx) % n) + n) % n;
    if (delta > n / 2) delta -= n;
    target.current = cur + delta;
  }, [selectedId, products, n]);

  // Drag handlers.
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    velocity.current = 0;
    window.clearTimeout(snapTimer.current);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      /* ignore (e.g. synthetic pointers) */
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    const delta = -dx / SPACING;
    position.current += delta;
    velocity.current = delta;
    target.current = position.current;
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const projected = position.current + velocity.current * 10;
    target.current = Math.round(projected);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="relative w-full h-[340px] md:h-[440px] select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ perspective: "1400px" }}
    >
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {products.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(p.image)}
              alt={`${p.name} — ${p.color}`}
              draggable={false}
              className="w-52 md:w-72 h-auto object-contain drop-shadow-2xl pointer-events-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

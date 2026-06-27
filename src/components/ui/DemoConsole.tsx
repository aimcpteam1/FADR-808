"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/constants";
import type { Product } from "@/lib/products";

/**
 * Demo console overlay.
 *
 * Renders the demo image and overlays:
 *  (1) the selected (carousel-centred) product in the right black area;
 *  (2) a START knob over the left turntable, coloured by the product and
 *      orbiting clockwise along the circle when clicked.
 *
 * Positions are percentages of the image box (tuned to demo.png, 1600×1117).
 */
const CIRCLE = { cx: 36.5, cy: 46.5, orbitR: 10.2, initAngle: 18 }; // % of width / deg
const KNOB_PCT = 7.6; // knob diameter, % of container width
const PRODUCT = { x: 76.5, y: 50, w: 25 }; // % box for the product image
const SPIN_PER_FRAME = 2.2; // deg/frame when spinning (clockwise)

export function DemoConsole({ product }: { product: Product }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const spinning = useRef(false);
  const angle = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const loop = () => {
      if (spinning.current) angle.current += SPIN_PER_FRAME;
      const a = CIRCLE.initAngle + angle.current;
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate(-50%, -50%) rotate(${a}deg)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `rotate(${-a}deg)`; // keep text upright
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const toggleSpin = () => {
    spinning.current = !spinning.current;
  };

  // knob size as a percentage of the orbit wrapper
  const knobInWrap = (KNOB_PCT / (CIRCLE.orbitR * 2)) * 100;

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Base demo image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/images/demo.png")}
        alt="FADR-808 demo console"
        className="block w-full h-auto select-none pointer-events-none"
        draggable={false}
      />

      {/* (1) Selected product in the right black area */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={product.id}
        src={asset(product.image)}
        alt={`${product.name} — ${product.color}`}
        className="absolute object-contain drop-shadow-2xl pointer-events-none"
        draggable={false}
        style={{
          left: `${PRODUCT.x}%`,
          top: `${PRODUCT.y}%`,
          width: `${PRODUCT.w}%`,
          transform: "translate(-50%, -50%)",
          animation: "demo-in 0.45s ease",
        }}
      />

      {/* (2) Orbit wrapper centred on the turntable circle */}
      <div
        ref={wrapRef}
        className="absolute"
        style={{
          left: `${CIRCLE.cx}%`,
          top: `${CIRCLE.cy}%`,
          width: `${CIRCLE.orbitR * 2}%`,
          aspectRatio: "1 / 1",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* START knob at 12 o'clock — coloured by product, clickable */}
        <button
          onClick={toggleSpin}
          aria-label="Spin"
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full grid place-items-center shadow-md cursor-pointer transition-colors duration-300"
          style={{
            width: `${knobInWrap}%`,
            aspectRatio: "1 / 1",
            backgroundColor: product.colorHex,
          }}
        >
          <span
            ref={labelRef}
            className="text-black font-bold leading-none"
            style={{ fontSize: "clamp(7px, 1vw, 14px)" }}
          >
            START
          </span>
        </button>
      </div>
    </div>
  );
}

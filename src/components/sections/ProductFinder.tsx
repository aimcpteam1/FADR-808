"use client";

import { useMemo, useState } from "react";
import {
  GENRES,
  COLORS,
  findBestProduct,
  type Genre,
  type ColorName,
} from "@/lib/products";
import { asset } from "@/constants";
import type { SectionProps } from "@/types";

/**
 * Build Your Beat — pick a genre + color, get the best-matched product (P01–P27)
 * from products.json and show its render.
 */
export function ProductFinder({ id = "finder", className }: SectionProps) {
  const [genre, setGenre] = useState<Genre>("House");
  const [color, setColor] = useState<ColorName>("Red");

  const product = useMemo(() => findBestProduct(genre, color), [genre, color]);

  return (
    <section
      id={id}
      className={[
        "relative bg-brand-bg text-center px-6 py-24 md:py-32",
        className ?? "",
      ].join(" ")}
    >
      <h2 className="font-mono font-bold text-white text-4xl md:text-6xl tracking-tight">
        Build Your Beat
      </h2>
      <p className="mt-5 mx-auto max-w-2xl font-mono text-white/70 text-sm md:text-base">
        Pick a genre and a color — we&apos;ll match your one-of-a-kind FADR-808.
      </p>

      <div className="mt-14 grid gap-12 md:grid-cols-2 max-w-5xl mx-auto items-start">
        {/* Selectors */}
        <div className="text-left">
          {/* Genre */}
          <p className="font-mono text-xs tracking-[0.3em] text-brand-muted uppercase mb-3">
            Genre
          </p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={[
                  "font-mono text-sm tracking-wider px-4 py-2 border transition-colors duration-150",
                  g === genre
                    ? "border-brand-lime bg-brand-lime text-black"
                    : "border-white/20 text-brand-text hover:border-brand-lime",
                ].join(" ")}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Color */}
          <p className="font-mono text-xs tracking-[0.3em] text-brand-muted uppercase mt-8 mb-3">
            Color
          </p>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                title={c.name}
                aria-label={c.name}
                className={[
                  "h-9 w-9 rounded-full border-2 transition-transform duration-150",
                  c.name === color
                    ? "border-brand-lime scale-110 shadow-[0_0_10px_var(--clr-lime)]"
                    : "border-white/20 hover:scale-105",
                ].join(" ")}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={product.id}
            src={asset(product.image)}
            alt={`${product.name} — ${product.color}`}
            className="w-72 md:w-96 h-auto object-contain drop-shadow-2xl"
          />
          <div className="mt-6 font-mono">
            <span className="text-brand-lime text-3xl md:text-4xl font-bold tracking-widest">
              {product.id}
            </span>
            <p className="mt-2 text-brand-text text-sm tracking-wider">
              {product.name} · {product.color}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

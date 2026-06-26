"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products";
import { asset } from "@/constants";
import { useGenreMusic } from "@/hooks";
import { ProductCarousel } from "@/components/ui";
import type { SectionProps } from "@/types";

const DEFAULT_ID = "P01";

const findById = (id: string) =>
  PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];

/**
 * Build Your Beat — a Cover-Flow product carousel driven by Claude Desktop (MCP).
 *
 * Claude writes the chosen id to /selection.json, which this section polls; the
 * carousel then slides that product to center. Dragging/wheeling browses freely;
 * the centered product drives the label and the genre music.
 */
export function ProductFinder({ id = "finder", className }: SectionProps) {
  const [selectedId, setSelectedId] = useState(DEFAULT_ID);
  const [center, setCenter] = useState<Product>(() => findById(DEFAULT_ID));
  const [musicGenre, setMusicGenre] = useState<string>();
  const musicTimer = useRef(0);

  // Auto-play the centered product's genre (debounced so fast scrubbing
  // doesn't thrash the audio). No UI.
  useGenreMusic(musicGenre);

  const handleCenter = (p: Product) => {
    setCenter(p);
    window.clearTimeout(musicTimer.current);
    musicTimer.current = window.setTimeout(() => setMusicGenre(p.genre), 250);
  };

  // Poll the MCP-written selection.
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch(asset(`/selection.json?t=${Date.now()}`), {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { productId?: string };
        if (active && data.productId && PRODUCTS.some((p) => p.id === data.productId)) {
          setSelectedId(data.productId);
        }
      } catch {
        /* selection.json not reachable yet — keep current */
      }
    };
    poll();
    const iv = setInterval(poll, 2000);
    return () => {
      active = false;
      clearInterval(iv);
    };
  }, []);

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
        Tell Claude your taste — e.g.{" "}
        <span className="text-brand-lime">&ldquo;I like House music and orange.&rdquo;</span>{" "}
        Your one-of-a-kind FADR-808 appears here.
      </p>

      <div className="mt-16 flex flex-col items-center">
        <ProductCarousel
          products={PRODUCTS}
          selectedId={selectedId}
          onCenterChange={handleCenter}
        />
        <div className="mt-6 font-mono">
          <span className="text-brand-lime text-3xl md:text-4xl font-bold tracking-widest">
            {center.id}
          </span>
          <p className="mt-2 text-brand-text text-sm tracking-wider">
            {center.name} · {center.color}
          </p>
        </div>
      </div>
    </section>
  );
}

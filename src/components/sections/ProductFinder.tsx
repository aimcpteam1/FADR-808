"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products";
import { asset } from "@/constants";
import { useGenreMusic } from "@/hooks";
import { ProductCarousel } from "@/components/ui";
import type { SectionProps } from "@/types";

const DEFAULT_ID = "P01";

/**
 * Build Your Beat — a Cover-Flow product carousel driven by Claude Desktop (MCP).
 *
 * Claude writes the chosen id to /selection.json, which this section polls; the
 * carousel then slides that product to center. Dragging/wheeling browses freely;
 * the centered product drives the label and the genre music.
 */
export function ProductFinder({ id = "finder", className }: SectionProps) {
  const [selectedId, setSelectedId] = useState(DEFAULT_ID);
  const [musicGenre, setMusicGenre] = useState<string>();
  const musicTimer = useRef(0);

  // Auto-play the centered product's genre (debounced so fast scrubbing
  // doesn't thrash the audio). No UI.
  useGenreMusic(musicGenre);

  const handleCenter = (p: Product) => {
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
      <h2
        className="font-bold text-white text-4xl md:text-6xl tracking-tight text-center"
        style={{ fontFamily: "var(--font-science)" }}
      >
        Build Your Beat
      </h2>
      <p
        className="mt-5 mx-auto max-w-2xl text-white/70 text-sm md:text-base text-center"
        style={{ fontFamily: "var(--font-science)" }}
      >
        Tell us your favorite music and colors. AI will create a one-of-a-kind
        FADR-808 speaker designed just for you.
      </p>

      <div className="mt-16 flex flex-col items-center">
        <ProductCarousel
          products={PRODUCTS}
          selectedId={selectedId}
          onCenterChange={handleCenter}
        />
      </div>

      <div className="mt-10 flex justify-center">
        <div className="px-6 py-3" style={{ backgroundColor: "#D9D9D9" }}>
          <p
            className="text-black text-sm md:text-base"
            style={{ fontFamily: "var(--font-science)" }}
          >
            e.g. &ldquo;I like House music and orange.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

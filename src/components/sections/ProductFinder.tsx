"use client";

import { useRef, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products";
import { useGenreMusic } from "@/hooks";
import { ProductCarousel, DemoConsole } from "@/components/ui";
import type { SectionProps } from "@/types";

const DEFAULT_ID = "P01";
const findById = (id: string) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];

// Public MCP server (Cloudflare Worker, Streamable HTTP).
const MCP_URL = "https://fadr-808-mcp.fadr-808.workers.dev/mcp";

/**
 * Build Your Beat — type your taste, hit Recommend; the deployed MCP picks a
 * product id and the carousel + demo update to it (image, colour, info, music).
 */
export function ProductFinder({ id = "finder", className }: SectionProps) {
  const [selectedId, setSelectedId] = useState(DEFAULT_ID);
  const [centerProduct, setCenterProduct] = useState<Product>(() => findById(DEFAULT_ID));
  const [musicGenre, setMusicGenre] = useState<string>();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const musicTimer = useRef(0);

  // Auto-play the centered product's genre (debounced). No UI.
  useGenreMusic(musicGenre);

  const handleCenter = (p: Product) => {
    setCenterProduct(p);
    window.clearTimeout(musicTimer.current);
    musicTimer.current = window.setTimeout(() => setMusicGenre(p.genre), 250);
  };

  // Call the deployed MCP `recommend` tool and select the returned product.
  const recommend = async () => {
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    try {
      const res = await fetch(MCP_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: { name: "recommend", arguments: { query: q } },
        }),
      });
      const data = await res.json();
      const text: string = data?.result?.content?.[0]?.text ?? "";
      const match = text.match(/P\d{2}/);
      if (match && PRODUCTS.some((p) => p.id === match[0])) {
        setSelectedId(match[0]); // carousel slides → demo image/colour/info/music update
      }
    } catch {
      /* network error — keep current selection */
    } finally {
      setLoading(false);
    }
  };

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

      {/* Type a preference → MCP recommend */}
      <div className="mt-6 flex justify-center gap-3 px-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") recommend();
          }}
          placeholder="I like House music and orange"
          className="w-full max-w-md bg-brand-surface border border-white/15 text-white placeholder-white/40 px-4 py-3 outline-none focus:border-brand-lime"
          style={{ fontFamily: "var(--font-science)" }}
        />
        <button
          onClick={recommend}
          disabled={loading}
          className="border-2 border-brand-lime text-brand-lime px-6 py-3 hover:bg-brand-lime hover:text-black transition-colors disabled:opacity-50"
          style={{ fontFamily: "var(--font-science)" }}
        >
          {loading ? "…" : "Recommend"}
        </button>
      </div>

      <div className="mt-12">
        <DemoConsole product={centerProduct} />
      </div>
    </section>
  );
}

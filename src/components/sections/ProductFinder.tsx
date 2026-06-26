"use client";

import { useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products";
import { asset } from "@/constants";
import type { SectionProps } from "@/types";

const DEFAULT_ID = "P01";

/**
 * Build Your Beat — the displayed product is driven by Claude Desktop (MCP).
 *
 * Tell Claude your taste in natural language; the MCP server writes the chosen
 * product id to /selection.json, which this section polls and renders. Only the
 * product image/id changes — layout and styling stay the same.
 */
export function ProductFinder({ id = "finder", className }: SectionProps) {
  const [product, setProduct] = useState<Product>(
    () => PRODUCTS.find((p) => p.id === DEFAULT_ID) ?? PRODUCTS[0]
  );

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const res = await fetch(asset(`/selection.json?t=${Date.now()}`), {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { productId?: string };
        const next = PRODUCTS.find((p) => p.id === data.productId);
        if (active && next && next.id !== product.id) setProduct(next);
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
  }, [product.id]);

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={product.id}
          src={asset(product.image)}
          alt={`${product.name} — ${product.color}`}
          className="w-72 md:w-96 h-auto object-contain drop-shadow-2xl transition-opacity duration-500"
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
    </section>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Product" };

export default function ProductPage() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <h1 className="font-display text-5xl text-brand-text tracking-widest">Product</h1>
    </section>
  );
}

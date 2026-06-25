import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <h1 className="font-display text-5xl text-brand-text tracking-widest">About</h1>
    </section>
  );
}

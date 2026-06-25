import type { Metadata } from "next";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <h1 className="font-display text-5xl text-brand-text tracking-widest">Experience</h1>
    </section>
  );
}

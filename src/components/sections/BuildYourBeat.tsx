import { asset } from "@/constants";
import type { SectionProps } from "@/types";

// Lineup order (left → right). The white FUNKHAUS unit sits center + largest.
// Widths use clamp() inline so they don't depend on Tailwind class detection.
const SPEAKERS = [
  { src: "/images/speaker-red.png",    alt: "RUB-A-DUB red FADR-808",  width: "clamp(6rem, 12vw, 12rem)" },
  { src: "/images/speaker-yellow.png", alt: "Yellow FADR-808",          width: "clamp(7rem, 14vw, 14rem)" },
  { src: "/images/speaker-white.png",  alt: "FUNKHAUS white FADR-808",  width: "clamp(9rem, 18vw, 18rem)" },
  { src: "/images/speaker-dots.png",   alt: "Polka-dot FADR-808",       width: "clamp(7rem, 14vw, 14rem)" },
  { src: "/images/speaker-green.png",  alt: "Mint green FADR-808",      width: "clamp(6rem, 12vw, 12rem)" },
];

/** "Build Your Beat" — AI-personalized speaker lineup. */
export function BuildYourBeat({ id = "build", className }: SectionProps) {
  return (
    <section
      id={id}
      className={[
        "relative bg-brand-bg text-center px-6 py-24 md:py-32 overflow-hidden",
        className ?? "",
      ].join(" ")}
    >
      <h2 className="font-mono font-bold text-white text-5xl md:text-7xl tracking-tight">
        Build Your Beat
      </h2>

      <p className="mt-6 mx-auto max-w-2xl font-mono text-white/70 text-base md:text-lg leading-relaxed">
        Tell us your favorite music and colors. AI will create a one-of-a-kind
        FADR-808 speaker designed just for you.
      </p>

      {/* Speaker lineup — center largest, aligned on a baseline */}
      <div className="mt-16 flex items-end justify-center gap-2 md:gap-6">
        {SPEAKERS.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={asset(s.src)}
            alt={s.alt}
            style={{ width: s.width }}
            className="h-auto object-contain drop-shadow-2xl"
          />
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import type { SectionProps } from "@/types";

/** "Plug Into FADR-808" — metallic banner with a CONNECT call to action. */
export function ConnectBanner({ id = "connect", className }: SectionProps) {
  return (
    <section
      id={id}
      className={["relative px-8 md:px-12 py-14", className ?? ""].join(" ")}
      style={{
        backgroundImage:
          "linear-gradient(110deg, #d4d8da 0%, #aeb4b7 38%, #cdd1d3 58%, #888e92 100%)",
      }}
    >
      <h2 className="font-body font-bold text-black text-2xl md:text-3xl tracking-tight">
        Plug Into FADR-808
      </h2>

      <div className="mt-8 max-w-3xl mx-auto text-center">
        <p className="font-mono text-brand-lime text-lg md:text-2xl leading-snug">
          Connect your website with a Custom Connector and let AI explore,
          understand, and interact with your content.
        </p>

        <Link
          href="/product"
          className="mt-6 inline-flex items-center justify-center
                     border-2 border-brand-lime text-black font-mono tracking-widest
                     px-10 py-3 hover:bg-brand-lime/30 transition-colors duration-200"
        >
          CONNECT
        </Link>
      </div>
    </section>
  );
}

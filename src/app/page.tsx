import { Hero, ProductFinder } from "@/components/sections";
import { asset } from "@/constants";

/**
 * Home — landing page.
 *
 *   Hero → (below-hero composition image) → Build Your Beat finder
 *
 * PRODUCT / EXPERIENCE / ABOUT are reached via the top navigation.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/images/description.jpg")}
        alt="FADR-808 — Plug In"
        className="block w-full h-auto"
      />
      <ProductFinder />
    </>
  );
}

import { Hero, ConnectBanner, BuildYourBeat } from "@/components/sections";

/**
 * Home — landing page.
 *
 *   Hero → Connect banner → Build Your Beat
 *
 * PRODUCT / EXPERIENCE / ABOUT are reached via the top navigation.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ConnectBanner />
      <BuildYourBeat />
    </>
  );
}

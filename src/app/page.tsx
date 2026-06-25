import {
  ClubEntrance,
  HeroJogWheel,
  ScrollTrack,
  MiniDJConsole,
  AudioReactive,
} from "@/components/sections";
import { SectionNav } from "@/components/layout";

/**
 * Home — the one-page FADR-808 experience.
 *
 * Each scene is an independent feature component, sequenced here in narrative
 * order. Section ids mirror EXPERIENCE_SECTIONS so SectionNav can navigate
 * between them without coupling to the features themselves.
 *
 *   ENTER → DECK → THE SET → CONSOLE → VISUALIZER
 */
export default function HomePage() {
  return (
    <>
      {/* ① Club Entrance Journey */}
      <ClubEntrance id="entrance" />

      {/* ② Hero Jog Wheel */}
      <HeroJogWheel id="deck" />

      {/* ③ One Track, One Scroll */}
      <ScrollTrack id="set" />

      {/* ④ Mini DJ Console Demo */}
      <MiniDJConsole id="console" />

      {/* ⑤ Audio-Reactive Neon */}
      <AudioReactive id="visualizer" />

      {/* Cross-scene navigation */}
      <SectionNav />
    </>
  );
}

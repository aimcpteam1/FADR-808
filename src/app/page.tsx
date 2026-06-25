import { ClubEntrance, HeroJogWheel, ScrollTrack } from "@/components/sections";

// Sections are imported here as they are built:
// import { DJConsole }    from "@/components/sections";
// import { NeonReactive } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      {/* ① Club Entrance Journey */}
      <ClubEntrance />

      {/* ② Hero Jog Wheel */}
      <HeroJogWheel />

      {/* ③ One Track, One Scroll */}
      <ScrollTrack />
      {/* ④ Mini DJ Console Demo   — coming soon */}
      {/* ⑤ Audio-Reactive Neon   — coming soon */}
    </>
  );
}

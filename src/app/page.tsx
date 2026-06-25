import { ClubEntrance, HeroJogWheel } from "@/components/sections";

// Sections are imported here as they are built:
// import { ScrollTrack }  from "@/components/sections";
// import { DJConsole }    from "@/components/sections";
// import { NeonReactive } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      {/* ① Club Entrance Journey */}
      <ClubEntrance />

      {/* ② Hero Jog Wheel */}
      <HeroJogWheel />

      {/* ③ One Track, One Scroll  — coming soon */}
      {/* ④ Mini DJ Console Demo   — coming soon */}
      {/* ⑤ Audio-Reactive Neon   — coming soon */}
    </>
  );
}

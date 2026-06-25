import { BRAND_NAME, BRAND_TAGLINE } from "@/constants";

// Sections are imported here as they are built:
// import { ClubEntrance } from "@/components/sections";
// import { HeroJogWheel } from "@/components/sections";
// import { ScrollTrack }  from "@/components/sections";
// import { DJConsole }    from "@/components/sections";
// import { NeonReactive } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      {/* ① Club Entrance Journey  — coming soon */}
      {/* ② Hero Jog Wheel         — coming soon */}
      {/* ③ One Track, One Scroll  — coming soon */}
      {/* ④ Mini DJ Console Demo   — coming soon */}
      {/* ⑤ Audio-Reactive Neon   — coming soon */}

      <section className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-7xl md:text-[12vw] text-brand-neon tracking-widest">
          {BRAND_NAME}
        </h1>
        <p className="font-mono text-brand-muted uppercase tracking-[0.4em] text-sm">
          {BRAND_TAGLINE}
        </p>
      </section>
    </>
  );
}

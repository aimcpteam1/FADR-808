import {
  ClubEntrance,
  HeroJogWheel,
  ScrollTrack,
  MiniDJConsole,
  AudioReactive,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      {/* ① Club Entrance Journey */}
      <ClubEntrance />

      {/* ② Hero Jog Wheel */}
      <HeroJogWheel />

      {/* ③ One Track, One Scroll */}
      <ScrollTrack />

      {/* ④ Mini DJ Console Demo */}
      <MiniDJConsole />

      {/* ⑤ Audio-Reactive Neon */}
      <AudioReactive />
    </>
  );
}

import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Inter, Science_Gothic } from "next/font/google";
import "./globals.css";

import { Navigation } from "@/components/layout";
import { Footer }     from "@/components/layout";
import { SmoothScrollProvider, AudioProvider } from "@/providers";
import { BRAND_NAME, BRAND_TAGLINE } from "@/constants";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const science = Science_Gothic({
  weight: ["400", "700"],
  variable: "--font-science",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:  `${BRAND_NAME} — ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: "DJ turntable Bluetooth speaker — Feel the Drop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${bebas.variable} ${jetbrains.variable} ${inter.variable} ${science.variable} dark`}
    >
      <body className="bg-brand-bg text-brand-text min-h-screen flex flex-col antialiased">
        <AudioProvider>
          <SmoothScrollProvider>
            <Navigation />
            <main className="flex-1 pt-[var(--nav-height)]">
              {children}
            </main>
            <Footer />
          </SmoothScrollProvider>
        </AudioProvider>
      </body>
    </html>
  );
}

"use client";

import { useId } from "react";

interface SpeakerProps {
  body: string;
  accent: string;
  dotted?: boolean;
  className?: string;
}

/**
 * Stylized FADR-808 boombox speaker (SVG placeholder).
 * Swap for a real product render later by replacing this with <Image/>.
 */
export function Speaker({ body, accent, dotted, className }: SpeakerProps) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 220 250"
      className={className}
      role="img"
      aria-label="FADR-808 speaker"
    >
      <defs>
        {dotted && (
          <pattern
            id={`dots-${uid}`}
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="9" cy="9" r="4" fill="#111" />
          </pattern>
        )}
        <radialGradient id={`cone-${uid}`} cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#5a5a5a" />
          <stop offset="70%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>

      {/* Handle */}
      <path
        d="M72 96 L72 50 Q72 34 88 34 L132 34 Q148 34 148 50 L148 96"
        fill="none"
        stroke="#8a8f93"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Body */}
      <rect x="42" y="90" width="136" height="150" rx="10" fill={body} />
      {dotted && (
        <rect
          x="42"
          y="90"
          width="136"
          height="150"
          rx="10"
          fill={`url(#dots-${uid})`}
        />
      )}
      <rect
        x="42"
        y="90"
        width="136"
        height="150"
        rx="10"
        fill="none"
        stroke="#0006"
      />

      {/* Turntable ring */}
      <circle
        cx="118"
        cy="172"
        r="46"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        opacity="0.75"
      />

      {/* Woofer */}
      <circle cx="92" cy="196" r="26" fill={`url(#cone-${uid})`} stroke="#000" />
      <circle cx="92" cy="196" r="9" fill="#2b2b2b" />

      {/* Tweeter */}
      <circle cx="78" cy="126" r="15" fill={`url(#cone-${uid})`} stroke="#000" />

      {/* Knob + buttons */}
      <circle cx="150" cy="150" r="12" fill={accent} />
      <circle cx="150" cy="150" r="5" fill="#0009" />
      <rect x="144" y="176" width="11" height="11" rx="2" fill={accent} />
      <rect x="144" y="193" width="11" height="11" rx="2" fill={accent} />
    </svg>
  );
}

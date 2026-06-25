"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface UseGSAPOptions {
  scope?: React.RefObject<HTMLElement | null>;
}

/**
 * Thin wrapper around gsap.context() for safe cleanup.
 * Pass a callback that sets up animations; they're automatically
 * reverted when the component unmounts.
 */
export function useGSAP(
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
  options: UseGSAPOptions = {}
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const ctx = gsap.context(callback, options.scope?.current ?? undefined);
    ctxRef.current = ctx;

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ctxRef;
}

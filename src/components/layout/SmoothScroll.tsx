 "use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/utils";
import { ensureGsap } from "@/lib/gsap";

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let detachScrollTrigger: (() => void) | undefined;

    (async () => {
      const gsap = await ensureGsap();
      // ScrollTrigger is registered inside ensureGsap
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ScrollTrigger = (gsap as any).core.globals().ScrollTrigger as {
        update: () => void;
      } | null;
      if (!ScrollTrigger) return;
      lenis.on("scroll", ScrollTrigger.update);
      detachScrollTrigger = () => lenis.off("scroll", ScrollTrigger.update);
    })();

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = window.requestAnimationFrame(raf);
    };
    rafRef.current = window.requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      detachScrollTrigger?.();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}


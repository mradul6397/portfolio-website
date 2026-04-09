"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { KineticText } from "@/components/ui/KineticText";

const HeroCanvas = dynamic(
  () => import("@/components/canvas/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false, loading: () => null },
);

export function Hero() {
  const wrapRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let killed = false;
    (async () => {
      const gsap = await ensureGsap();
      if (killed) return;
      const el = wrapRef.current;
      if (!el) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        el.querySelectorAll("[data-hero-fade]"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, delay: 0.15 },
      );
      cleanup = () => tl.kill();
    })();

    return () => {
      killed = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      id="top"
      className="relative min-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="grid-glow" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_10%,rgba(77,255,180,0.10),transparent_60%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/35 to-black"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 py-20">
        <div
          data-hero-fade
          className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-25" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          </span>
          <span className="tracking-wide">CURRENTLY AVAILABLE FOR WORK</span>
        </div>

        <KineticText
          as="h1"
          text="Prash"
          className="font-[var(--font-display)] text-[clamp(56px,10vw,120px)] tracking-[-0.04em]"
        />
        <KineticText
          as="h2"
          text="I build cinematic, interactive web experiences."
          delay={0.15}
          className="mt-3 max-w-2xl text-[clamp(18px,2.2vw,28px)] font-medium tracking-[-0.02em] text-white/80"
        />

        <p
          data-hero-fade
          className="mt-6 max-w-xl text-sm leading-7 text-white/60"
        >
          Next.js • Three.js • GSAP • Product-level polish. Scroll down — every
          section is choreographed.
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}>
            View work
            <span aria-hidden className="text-white/60">
              ↳
            </span>
          </MagneticButton>
          <a
            data-cursor="hover"
            href="#contact"
            className="rounded-full px-4 py-2 text-sm text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/40"
          >
            Contact
          </a>
        </div>

        <div
          data-hero-fade
          className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 md:block"
        >
          <div className="flex items-center gap-3 text-xs tracking-[0.35em] text-white/45">
            <span>SCROLL</span>
            <span className="h-px w-10 bg-white/20" />
            <span className="inline-block animate-[bounce_1.4s_ease-in-out_infinite]">
              ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}


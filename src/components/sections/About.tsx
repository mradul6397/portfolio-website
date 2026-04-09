"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

const AboutCanvas = dynamic(
  () => import("@/components/canvas/AboutCanvas").then((m) => m.AboutCanvas),
  { ssr: false, loading: () => null },
);

const SKILLS = [
  "Next.js",
  "TypeScript",
  "Three.js",
  "GSAP",
  "Framer Motion",
  "WebGL",
  "Tailwind",
  "UX polish",
  "Performance",
];

function splitToSpans(text: string) {
  return Array.from(text).map((c, i) => (
    <span
      key={`${c}-${i}`}
      className={cn("inline-block will-change-transform", c === " " && "w-[0.35em]")}
      data-split-char
    >
      {c}
    </span>
  ));
}

export function About() {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    let killed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = await ensureGsap();
      if (killed) return;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const chars = section.querySelectorAll("[data-split-char]");
      gsap.fromTo(
        chars,
        { yPercent: 120, opacity: 0, rotateX: -65 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.008,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        },
      );

      gsap.fromTo(
        section.querySelectorAll("[data-pill]"),
        { y: 12, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.6)",
          stagger: 0.05,
          scrollTrigger: { trigger: section, start: "top 55%" },
        },
      );

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        ScrollTrigger.refresh();
      };
    })();

    return () => {
      killed = true;
      cleanup?.();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative border-t border-white/10 bg-black"
    >
      <div ref={trackRef} className="flex min-h-[100svh] w-max">
        <div className="flex w-screen items-center px-6 py-20">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <div className="text-xs tracking-[0.35em] text-white/55">
                ABOUT
              </div>
              <h3 className="mt-5 font-[var(--font-display)] text-4xl tracking-[-0.03em] md:text-5xl">
                {splitToSpans("Design-first engineering. Motion with intent.")}
              </h3>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/60">
                I obsess over interaction details — scroll choreography, tactile
                haptics (without haptics), and micro‑physics that make a site
                feel alive.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {SKILLS.map((s) => (
                  <span
                    key={s}
                    data-pill
                    className={cn(
                      "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur",
                      "transition-colors hover:bg-white/10",
                    )}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="absolute inset-0">
                <AboutCanvas />
              </div>
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_320px_at_40%_20%,rgba(77,255,180,0.18),transparent_60%)]"
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div className="flex w-screen items-center px-6 py-20">
          <div className="mx-auto w-full max-w-6xl">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
              <div className="text-xs tracking-[0.35em] text-white/55">
                PRINCIPLES
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {[
                  {
                    t: "Cinematic scroll",
                    d: "Pin, scrub, stagger — but always readable and purposeful.",
                  },
                  {
                    t: "3D, tastefully",
                    d: "Ambient WebGL that supports the story, not hijacks it.",
                  },
                  {
                    t: "Performance first",
                    d: "Lazy-load canvases, kill triggers, respect reduced motion.",
                  },
                ].map((x) => (
                  <div key={x.t} className="rounded-2xl border border-white/10 bg-black/25 p-6">
                    <div className="text-sm font-semibold tracking-tight">
                      {x.t}
                    </div>
                    <div className="mt-2 text-sm leading-7 text-white/60">
                      {x.d}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


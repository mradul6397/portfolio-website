"use client";

import { useEffect, useMemo } from "react";
import { ensureGsap } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

const STEPS = [
  { t: "Discover", d: "Goals, audience, constraints, references." },
  { t: "Design", d: "Type, grid, motion language, system tokens." },
  { t: "Build", d: "Next.js + motion stack, performance-first." },
  { t: "Polish", d: "Micro-interactions, QA, accessibility, metrics." },
];

export function Process() {
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    if (reduced) return;
    let killed = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const gsap = await ensureGsap();
      if (killed) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: "#process", start: "top 75%" },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        "#process [data-step]",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.1 },
      );

      tl.fromTo(
        "#process [data-proc-line]",
        { scaleY: 0 },
        { scaleY: 1, duration: 1.0, ease: "power2.inOut" },
        0,
      );

      cleanup = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    })();

    return () => {
      killed = true;
      cleanup?.();
    };
  }, [reduced]);

  return (
    <section
      id="process"
      className="relative border-t border-white/10 bg-black px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-xs tracking-[0.35em] text-white/55">PROCESS</div>
        <h3 className="mt-5 font-[var(--font-display)] text-4xl tracking-[-0.03em] md:text-5xl">
          A predictable path to wow.
        </h3>

        <div className="relative mt-12 grid gap-6 md:grid-cols-2">
          <div
            data-proc-line
            className="absolute left-[13px] top-2 hidden h-[calc(100%-8px)] w-px origin-top bg-white/15 md:block"
          />
          {STEPS.map((s, i) => (
            <div
              key={s.t}
              data-step
              className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 hidden md:block">
                  <div className="grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-black/40 text-xs text-white/60">
                    {(i + 1).toString().padStart(2, "0")}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight">
                    {s.t}
                  </div>
                  <div className={cn("mt-2 text-sm leading-7 text-white/60")}>
                    {s.d}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ensureGsap } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

type Props = {
  onDone?: () => void;
};

function makeParticles(count: number) {
  return Array.from({ length: count }).map((_, i) => {
    const a = (i / count) * Math.PI * 2;
    const r = 24 + Math.random() * 28;
    return {
      key: i,
      x: Math.cos(a) * r,
      y: Math.sin(a) * r,
      s: 0.6 + Math.random() * 0.9,
      d: 0.45 + Math.random() * 0.6,
    };
  });
}

export function Preloader({ onDone }: Props) {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const particles = useMemo(() => makeParticles(22), []);

  useEffect(() => {
    if (reduced) {
      setPct(100);
      setDone(true);
      onDone?.();
      return;
    }

    let killed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = await ensureGsap();
      if (killed) return;

      const obj = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          setDone(true);
          onDone?.();
        },
      });

      tl.to(obj, {
        v: 100,
        duration: 1.25,
        ease: "power3.inOut",
        onUpdate: () => setPct(Math.round(obj.v)),
      });

      tl.to(
        wrapRef.current,
        {
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          pointerEvents: "none",
        },
        "+=0.1",
      );

      cleanup = () => tl.kill();
    })();

    return () => {
      killed = true;
      cleanup?.();
    };
  }, [onDone, reduced]);

  if (done) return null;

  return (
    <div
      ref={wrapRef}
      className={cn(
        "fixed inset-0 z-[80] grid place-items-center bg-black",
        "text-white",
      )}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative grid h-24 w-24 place-items-center">
          <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 backdrop-blur-md" />
          <svg
            className="absolute inset-0"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={((100 - pct) / 100) * 2 * Math.PI * 44}
            />
          </svg>

          <div className="text-xl font-semibold tabular-nums">
            {pct.toString().padStart(3, "0")}
          </div>
        </div>

        <div className="mt-6 text-xs tracking-[0.35em] text-white/60">
          LOADING
        </div>

        <div className="pointer-events-none absolute top-10">
          {pct >= 100 &&
            particles.map((p) => (
              <span
                key={p.key}
                style={
                  {
                    "--px": `${p.x}px`,
                    "--py": `${p.y}px`,
                    "--ps": p.s,
                    "--pd": `${p.d}s`,
                  } as CSSProperties
                }
                className={cn(
                  "absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  "bg-[var(--accent)] opacity-0",
                  "animate-[particle_0.6s_ease-out_forwards] [animation-duration:var(--pd)]",
                )}
              />
            ))}
        </div>
      </div>
    </div>
  );
}


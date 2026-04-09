"use client";

import { useEffect, useMemo, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

type Props = {
  text: string;
  as?: "h1" | "h2" | "p" | "div";
  className?: string;
  delay?: number;
};

export function KineticText({ text, as = "div", className, delay = 0 }: Props) {
  const Tag: any = as;
  const wrapRef = useRef<any>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const chars = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    if (reduced) return;
    let killed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = await ensureGsap();
      if (killed) return;
      const el = wrapRef.current;
      if (!el) return;

      const spans = Array.from(el.querySelectorAll("[data-kt-char]"));
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        spans,
        { yPercent: 120, opacity: 0, rotateX: -65 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.018,
          delay,
        },
      );

      cleanup = () => tl.kill();
    })();

    return () => {
      killed = true;
      cleanup?.();
    };
  }, [delay, reduced, text]);

  return (
    <Tag ref={wrapRef} aria-label={text} className={cn("leading-none", className)}>
      {chars.map((c, i) => (
        <span
          key={`${c}-${i}`}
          data-kt-char
          className={cn(
            "inline-block will-change-transform",
            c === " " ? "w-[0.35em]" : "",
          )}
        >
          {c}
        </span>
      ))}
    </Tag>
  );
}


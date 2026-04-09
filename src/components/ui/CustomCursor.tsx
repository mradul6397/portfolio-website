"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn, isTouchDevice, prefersReducedMotion } from "@/lib/utils";

type CursorVariant = "default" | "hover" | "hidden";

function getVariantFromTarget(target: EventTarget | null): CursorVariant {
  if (!(target instanceof Element)) return "default";

  const interactive = target.closest(
    '[data-cursor="hover"], a, button, input, textarea, select, [role="button"]',
  );
  return interactive ? "hover" : "default";
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const pos = useMemo(() => ({ x: 0, y: 0, tx: 0, ty: 0 }), []);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isTouchDevice() || prefersReducedMotion()) return;

    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      setVariant((v) => (v === "hidden" ? "default" : v));
    };

    const onLeave = () => setVariant("hidden");
    const onOver = (e: PointerEvent) => setVariant(getVariantFromTarget(e.target));
    const onDown = () => setVariant("hover");
    const onUp = (e: PointerEvent) => setVariant(getVariantFromTarget(e.target));

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    const loop = () => {
      pos.x += (pos.tx - pos.x) * 0.22;
      pos.y += (pos.ty - pos.y) * 0.22;

      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) dot.style.transform = `translate3d(${pos.tx}px, ${pos.ty}px, 0)`;
      if (ring) ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

      raf.current = window.requestAnimationFrame(loop);
    };

    raf.current = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, [pos]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[60] hidden md:block",
          "h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full",
          "border border-white/20 bg-white/5 backdrop-blur-sm",
          "transition-[opacity,transform,width,height] duration-200 ease-out",
          variant === "hidden" && "opacity-0",
          variant === "hover" && "h-16 w-16 border-white/35 bg-white/10",
        )}
      />
      <div
        ref={dotRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[61] hidden md:block",
          "h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
          "bg-[var(--accent)] shadow-[0_0_24px_rgba(77,255,180,0.35)]",
          "transition-opacity duration-200 ease-out",
          variant === "hidden" && "opacity-0",
        )}
      />
    </>
  );
}


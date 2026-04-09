"use client";

import { type ButtonHTMLAttributes, useMemo, useRef } from "react";
import { cn, prefersReducedMotion } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  strength?: number;
};

export function MagneticButton({
  className,
  strength = 0.35,
  children,
  ...props
}: Props) {
  const wrapRef = useRef<HTMLButtonElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  return (
    <button
      ref={wrapRef}
      data-cursor="hover"
      className={cn(
        "group relative inline-flex select-none items-center justify-center rounded-full",
        "bg-white/5 px-6 py-3 text-sm font-medium text-white",
        "border border-white/10 backdrop-blur-md",
        "transition-colors duration-300 hover:bg-white/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50",
        className,
      )}
      onPointerMove={(e) => {
        if (reduced) return;
        const wrap = wrapRef.current;
        const inner = innerRef.current;
        if (!wrap || !inner) return;

        const r = wrap.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        const mx = ((e.clientX - r.left) / r.width) * 100;
        const my = ((e.clientY - r.top) / r.height) * 100;
        wrap.style.setProperty("--mx", `${mx}%`);
        wrap.style.setProperty("--my", `${my}%`);
        inner.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      }}
      onPointerLeave={() => {
        const inner = innerRef.current;
        if (!inner) return;
        inner.style.transform = "translate3d(0,0,0)";
      }}
      {...props}
    >
      <span
        ref={innerRef}
        className={cn(
          "inline-flex items-center gap-2 will-change-transform",
          "transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
        )}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full opacity-0",
          "transition-opacity duration-300 group-hover:opacity-100",
          "bg-[radial-gradient(120px_circle_at_var(--mx,50%)_var(--my,50%),rgba(77,255,180,0.18),transparent_60%)]",
        )}
      />
    </button>
  );
}


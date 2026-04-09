"use client";

import { cn, prefersReducedMotion } from "@/lib/utils";

type Props = {
  items: string[];
  className?: string;
};

export function Marquee({ items, className }: Props) {
  const reduced = prefersReducedMotion();
  const content = items.join("  •  ");

  return (
    <div className={cn("overflow-hidden border-t border-white/10", className)}>
      <div
        className={cn(
          "flex whitespace-nowrap py-4 text-xs tracking-[0.28em] text-white/55",
          reduced
            ? "justify-center"
            : "animate-[marquee_18s_linear_infinite] [will-change:transform]",
        )}
        style={reduced ? undefined : { width: "200%" }}
      >
        <div className={cn("w-1/2")}>{content}</div>
        {!reduced && <div className="w-1/2">{content}</div>}
      </div>
    </div>
  );
}


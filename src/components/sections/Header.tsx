"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-[70] w-full px-6 py-5",
        "transition-[background-color,border-color] duration-300",
        scrolled && "bg-black/55 backdrop-blur-xl border-b border-white/10",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a
          data-cursor="hover"
          href="#top"
          className="text-xs tracking-[0.35em] text-white/70 hover:text-white transition-colors"
        >
          PRASH
        </a>
        <nav className="hidden items-center gap-6 text-xs tracking-[0.28em] text-white/55 md:flex">
          {[
            ["About", "#about"],
            ["Work", "#work"],
            ["Process", "#process"],
            ["Contact", "#contact"],
          ].map(([t, href]) => (
            <a
              key={t}
              data-cursor="hover"
              href={href}
              className="transition-colors hover:text-white"
            >
              {t}
            </a>
          ))}
        </nav>
        <a
          data-cursor="hover"
          href="#contact"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
        >
          LET’S TALK
        </a>
      </div>
    </header>
  );
}


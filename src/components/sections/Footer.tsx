"use client";

import { Marquee } from "@/components/ui/Marquee";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <Marquee
        items={[
          "Next.js",
          "Three.js",
          "GSAP",
          "Framer Motion",
          "TypeScript",
          "Awwwards energy",
          "Craft",
          "Performance",
        ]}
      />
      <div className="px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="text-sm text-white/60">
            <span className="text-white/80">Prash</span> — interactive web
            portfolio
          </div>
          <div className="flex flex-wrap gap-6 text-xs tracking-[0.28em] text-white/55">
            {[
              ["Top", "#top"],
              ["About", "#about"],
              ["Work", "#work"],
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
          </div>
          <div className="text-xs text-white/45">
            © {new Date().getFullYear()} • Built with motion.
          </div>
        </div>
      </div>
    </footer>
  );
}


"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ensureGsap } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

type Project = {
  title: string;
  desc: string;
  tag: "Web" | "3D" | "Design";
  year: string;
  image: string;
};

const PROJECTS: Project[] = [
  {
    title: "Nebula Commerce",
    desc: "High-end storefront with scroll-driven storytelling and microphysics.",
    tag: "Web",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Orbit Studio",
    desc: "3D brand world with cursor-parallax depth and ambient motion.",
    tag: "3D",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Editorial System",
    desc: "Design system + typography engine with flawless rhythm and transitions.",
    tag: "Design",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1400&q=80",
  },
];

const FILTERS = ["All", "Web", "3D", "Design"] as const;
type Filter = (typeof FILTERS)[number];

export function Work() {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = PROJECTS.filter((p) => filter === "All" || p.tag === filter);

  useEffect(() => {
    if (reduced) return;
    let killed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = await ensureGsap();
      if (killed) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#work",
          start: "top 70%",
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        "#work [data-work-reveal]",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
      );

      tl.fromTo(
        "#work [data-line]",
        { scaleY: 0 },
        { scaleY: 1, duration: 1.1, ease: "power2.inOut" },
        0.1,
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
  }, [reduced, filter]);

  return (
    <section
      id="work"
      className="relative border-t border-white/10 bg-black px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div data-work-reveal>
            <div className="text-xs tracking-[0.35em] text-white/55">
              SELECTED WORK
            </div>
            <h3 className="mt-5 font-[var(--font-display)] text-4xl tracking-[-0.03em] md:text-5xl">
              Projects that move.
            </h3>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">
              Full-screen cards with tactile hover, clip-path reveals, and
              layout motion — built like a product.
            </p>
          </div>

          <div data-work-reveal className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  data-cursor="hover"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs tracking-wide backdrop-blur",
                    active
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                    "transition-colors",
                  )}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, idx) => (
              <motion.article
                key={p.title}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur",
                  "min-h-[260px] md:min-h-[320px]",
                )}
              >
                <div className="absolute inset-0">
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                      "bg-[radial-gradient(700px_360px_at_30%_20%,rgba(77,255,180,0.18),transparent_60%)]",
                    )}
                    aria-hidden
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-cover bg-center",
                      "opacity-0 transition-opacity duration-500 group-hover:opacity-70",
                      "translate-y-6 transition-transform duration-700 group-hover:translate-y-0",
                      "will-change-transform",
                      "[clip-path:inset(16%_8%_16%_8%_round_28px)] group-hover:[clip-path:inset(0%_0%_0%_0%_round_28px)]",
                      "transition-[clip-path,transform,opacity] ease-[cubic-bezier(.2,.8,.2,1)]",
                    )}
                    style={{ backgroundImage: `url(${p.image})` }}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/45 to-black/70"
                    aria-hidden
                  />
                </div>

                <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          data-line
                          className="absolute left-1 top-1 h-10 w-px origin-top bg-white/25"
                        />
                        <div className="text-xs tabular-nums text-white/55">
                          {(idx + 1).toString().padStart(2, "0")}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs tracking-[0.28em] text-white/55">
                          {p.tag} • {p.year}
                        </div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
                          {p.title}
                        </div>
                      </div>
                    </div>

                    <a
                      data-cursor="hover"
                      href="#contact"
                      className={cn(
                        "shrink-0 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-white/70",
                        "transition-colors hover:bg-white/10 hover:text-white",
                      )}
                    >
                      Request case study
                    </a>
                  </div>

                  <div className="mt-10 max-w-2xl text-sm leading-7 text-white/60">
                    {p.desc}
                  </div>

                  <div className="mt-10 flex flex-wrap gap-2">
                    {["UX", "Motion", "Perf", "Craft"].map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}


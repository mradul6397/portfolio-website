"use client";

import { useEffect, useMemo, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Contact() {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;
    if (reduced) return;

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      title.style.setProperty("--tx", `${nx * 10}px`);
      title.style.setProperty("--ty", `${ny * 10}px`);
    };
    section.addEventListener("pointermove", onMove, { passive: true });
    return () => section.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let killed = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const gsap = await ensureGsap();
      if (killed) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact",
          start: "top 70%",
        },
        defaults: { ease: "power3.out" },
      });
      tl.fromTo(
        "#contact [data-contact-reveal]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
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
      ref={sectionRef}
      id="contact"
      className="relative border-t border-white/10 bg-black px-6 py-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 md:grid-cols-2">
        <div data-contact-reveal>
          <div className="text-xs tracking-[0.35em] text-white/55">
            CONTACT
          </div>
          <div
            ref={titleRef}
            className={cn(
              "mt-6 font-[var(--font-display)] text-[clamp(46px,7vw,88px)] tracking-[-0.04em]",
              "[transform:translate3d(var(--tx,0),var(--ty,0),0)] transition-transform duration-200 ease-out",
            )}
          >
            Let’s build something unreal.
          </div>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/60">
            Tell me what you’re shipping. I’ll respond with a plan, timeline,
            and a few interaction ideas tailored to your product.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { t: "Email", v: "hello@yourdomain.com" },
              { t: "Location", v: "Remote • GMT+5:30" },
              { t: "Availability", v: "Open for select work" },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70 backdrop-blur"
              >
                <div className="tracking-[0.25em] text-white/45">{x.t}</div>
                <div className="mt-1 font-medium text-white/75">{x.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-4 text-sm">
            {["GitHub", "LinkedIn", "X"].map((s) => (
              <a
                key={s}
                data-cursor="hover"
                href="#"
                className="group inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition-colors group-hover:bg-[var(--accent)]" />
                {s}
              </a>
            ))}
          </div>
        </div>

        <div data-contact-reveal className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-10">
          <form
            className="grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Name" name="name" />
              <Field label="Email" name="email" type="email" />
            </div>
            <Field label="Project" name="project" />
            <Field label="Message" name="message" textarea />

            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="text-xs leading-6 text-white/50">
                This form is demo-only. Wire to your backend or email service.
              </div>
              <MagneticButton type="submit">Send</MagneticButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  const common =
    "peer w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm text-white/80 outline-none transition-colors placeholder:text-transparent focus:border-white/20";

  return (
    <label className="relative block">
      {textarea ? (
        <textarea
          name={name}
          rows={5}
          className={cn(common, "resize-none")}
          placeholder={label}
        />
      ) : (
        <input
          name={name}
          type={type}
          className={common}
          placeholder={label}
        />
      )}
      <span
        className={cn(
          "pointer-events-none absolute left-4 top-4 text-xs tracking-wide text-white/45",
          "origin-left transition-all duration-200 ease-out",
          "peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-white/60",
          "peer-[&:not(:placeholder-shown)]:-translate-y-3 peer-[&:not(:placeholder-shown)]:scale-90",
        )}
      >
        {label}
      </span>
    </label>
  );
}


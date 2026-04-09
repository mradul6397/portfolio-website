let _registered = false;

export async function ensureGsap() {
  const { gsap } = await import("gsap");

  if (!_registered && typeof window !== "undefined") {
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
    _registered = true;
  }

  return gsap;
}


"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/lib/utils";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = prefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, clipPath: "inset(0 0 100% 0 round 24px)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 24px)" }}
        exit={{ opacity: 0, clipPath: "inset(100% 0 0% 0 round 24px)" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


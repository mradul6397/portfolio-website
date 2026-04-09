"use client";

import { useState } from "react";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { PageTransition } from "@/components/layout/PageTransition";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/ui/Preloader";

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      {ready && <SmoothScroll />}
      <CustomCursor />
      <PageTransition>{children}</PageTransition>
    </>
  );
}


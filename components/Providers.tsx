"use client";

import { MotionConfig } from "motion/react";

/** reducedMotion="user" → animasi otomatis dimatikan bila pengunjung mengaktifkan "reduce motion". */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

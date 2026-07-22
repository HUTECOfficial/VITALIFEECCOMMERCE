"use client";

import { useScroll, motion, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 origin-left"
      style={{
        scaleX: progress,
        background: "linear-gradient(90deg, #1a3a6b, #2eb8d4)",
      }}
    />
  );
}

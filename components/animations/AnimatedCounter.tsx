"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number | string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const isNumeric = typeof target === "number";

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    let startTime: number;
    const startValue = 0;
    const endValue = target as number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (endValue - startValue) + startValue));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration, isNumeric]);

  return (
    <span ref={ref} className={className}>
      {isNumeric ? count : target}
    </span>
  );
}

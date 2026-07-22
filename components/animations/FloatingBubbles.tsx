"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
}

export default function FloatingBubbles({ count = 6 }: { count?: number }) {
  // Empty on server, generated only on client to avoid hydration mismatch
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    setBubbles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: Math.random() * 120 + 60,
        x: `${Math.random() * 90}%`,
        y: `${Math.random() * 90}%`,
        delay: Math.random() * 3,
        duration: Math.random() * 4 + 4,
      }))
    );
  }, [count]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * 0.02);
      mouseY.set((e.clientY - window.innerHeight / 2) * 0.02);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.x,
            top: bubble.y,
            x: springX,
            y: springY,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 8, -8, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

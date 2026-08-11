"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const TOTAL_DURATION_MS = 2100;

export function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setVisible(false), TOTAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{ clipPath: "circle(150% at 50% 50%)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-primary/40"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1.7, opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.4, rotate: -140 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src="/logo-icon.png"
                  alt="Tripora"
                  width={96}
                  height={96}
                  priority
                  className="h-20 w-20 object-contain"
                />
              </motion.div>
            </div>
            <motion.span
              className="text-2xl font-bold tracking-tight text-primary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            >
              Tripora
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

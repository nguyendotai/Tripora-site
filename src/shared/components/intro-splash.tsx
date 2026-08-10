'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/**
 * Splash hiện mỗi lần vào trang/F5 (mount lại theo full page load, không dùng
 * sessionStorage nên không tự tắt vĩnh viễn) — nền trắng cố định bất kể theme,
 * giống quy ước Hero/Trusted-by Strip ở frontend/CLAUDE.md mục 6.2, để logo gốc
 * (navy + teal) luôn đủ contrast dù site đang Light/Dark.
 */
export function IntroSplash() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), reduce ? 0 : 1400);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src="/logo-icon.png" alt="" width={72} height={72} className="size-18" priority />
            <span className="text-xl font-bold tracking-tight text-[#14365C]">Tripora</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

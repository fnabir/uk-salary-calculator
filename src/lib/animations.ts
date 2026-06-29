import type { Transition, Variants } from "framer-motion";

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const transitions = {
  smooth: { duration: 0.3, ease: "easeInOut" } as Transition,
  snappy: { duration: 0.2, ease: "easeOut" } as Transition,
  spring: { type: "spring", stiffness: 300, damping: 30 } as Transition,
};

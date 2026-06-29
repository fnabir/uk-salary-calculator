import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion } from "framer-motion";
import { fadeInUp, transitions } from "@/lib/animations";

export function Header() {
  return (
    <header className="w-full bg-card sticky top-0 z-50 mx-auto border-b border-border px-4 py-3 flex items-center justify-between shadow-lg">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={transitions.snappy}
        className="hidden lg:flex items-center justify-center gap-2 lg:w-14"
      >
        <Image src="/logo.png" alt="Logo" width={48} height={48} priority />
      </motion.div>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={transitions.snappy}
        className="lg:text-center"
      >
        <h1 className="text-lg font-semibold tracking-tight">
          UK Salary Calculator
        </h1>
        <p className="text-sm">Tax Year 2026/27</p>
      </motion.div>

      <div className="w-fit lg:w-14">
        <ThemeToggle />
      </div>
    </header>
  );
}

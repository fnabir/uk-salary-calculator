"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, transitions } from "@/lib/animations";
import { formatCurrency } from "@/lib/utils";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { useTransform } from "framer-motion";

interface SummaryCardsProps {
  gross: number;
  totalDeductions: number;
  net: number;
}

interface SummaryCardProps {
  label: string;
  value: number;
  variant?: "default" | "deduction" | "highlight";
}

function SummaryCard({ label, value, variant = "default" }: SummaryCardProps) {
  const animatedValue = useAnimatedNumber(value);
  const formatted = useTransform(animatedValue, (v) => formatCurrency(v));

  const variantStyles = {
    default: "bg-muted/50 border-border",
    deduction: "bg-destructive/5 border-destructive/20",
    highlight: "bg-green-500/5 border-green-500/20",
  };

  const valueStyles = {
    default: "text-foreground",
    deduction: "text-destructive",
    highlight: "text-green-700 dark:text-green-400",
  };

  return (
    <motion.div
      variants={fadeInUp}
      transition={transitions.snappy}
      className={`
        rounded-lg border p-4 flex flex-col gap-1
        ${variantStyles[variant]}
      `}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <motion.p
        className={`text-xl font-semibold tabular-nums ${valueStyles[variant]}`}
      >
        {formatted}
      </motion.p>
    </motion.div>
  );
}

export function SummaryCards({
  gross,
  totalDeductions,
  net,
}: SummaryCardsProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <SummaryCard label="Gross Pay" value={gross} variant="default" />
      <SummaryCard
        label="Total Deductions"
        value={totalDeductions}
        variant="deduction"
      />
      <SummaryCard label="Take Home Pay" value={net} variant="highlight" />
    </motion.div>
  );
}

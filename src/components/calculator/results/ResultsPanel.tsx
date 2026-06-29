// src/components/calculator/results/ResultsPanel.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, transitions } from "@/lib/animations";
import { PeriodToggle, type Period } from "./PeriodToggle";
import { SummaryCards } from "./SummaryCards";
import { BreakdownSection } from "./BreakdownSection";
import { Separator } from "@/components/ui/separator";
import type { TakeHomeResult } from "@/lib/tax/calculations";

interface ResultsPanelProps {
  result: TakeHomeResult;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const [period, setPeriod] = useState<Period>("annual");

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Period toggle */}
      <motion.div variants={fadeInUp} transition={transitions.snappy}>
        <PeriodToggle value={period} onChange={setPeriod} />
      </motion.div>

      {/* Summary cards */}
      <motion.div variants={fadeInUp} transition={transitions.snappy}>
        <SummaryCards
          gross={result.gross[period]}
          totalDeductions={result.totalDeductions[period]}
          net={result.net[period]}
        />
      </motion.div>

      <Separator />

      {/* Breakdown */}
      <motion.div variants={fadeInUp} transition={transitions.smooth}>
        <BreakdownSection result={result} period={period} />
      </motion.div>
    </motion.div>
  );
}

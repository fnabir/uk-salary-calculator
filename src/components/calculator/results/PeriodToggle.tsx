"use client";

import { motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fadeInUp, transitions } from "@/lib/animations";

export type Period = "annual" | "monthly" | "weekly";

interface PeriodToggleProps {
  value: Period;
  onChange: (value: Period) => void;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: "annual", label: "Annual" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
];

export function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  return (
    <motion.div variants={fadeInUp} transition={transitions.snappy}>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as Period)}
        className="justify-start"
      >
        {PERIODS.map((period) => (
          <ToggleGroupItem
            key={period.value}
            value={period.value}
            className="text-xs px-4"
          >
            {period.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </motion.div>
  );
}

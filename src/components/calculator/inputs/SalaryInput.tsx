// src/components/calculator/inputs/SalaryInput.tsx
"use client";

import { motion } from "framer-motion";
import { fadeInUp, transitions } from "@/lib/animations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface SalaryInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function SalaryInput({ value, onChange }: SalaryInputProps) {
  // Keep raw string locally so trailing dots and zeros aren't swallowed
  const [raw, setRaw] = useState(value === 0 ? "" : String(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Allow digits, a single dot, and leading dot (e.g. ".50")
    if (!/^(\d+\.?\d*|\.\d*)$/.test(input) && input !== "") return;

    if (input === ".") {
      setRaw("0.");
      onChange(0);
      return;
    }

    if (input === "0") {
      setRaw("");
      return;
    }

    setRaw(input);

    const parsed = parseFloat(input);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <motion.div
      className="flex flex-col gap-2"
      variants={fadeInUp}
      transition={transitions.snappy}
    >
      <Label htmlFor="salary">Annual Gross Salary</Label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
          £
        </span>

        <Input
          id="salary"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={raw}
          onChange={handleChange}
          className="pl-7"
        />
      </div>

      {value > 0 && (
        <motion.p
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transitions.snappy}
        >
          {formatCurrency(value)} per year
        </motion.p>
      )}
    </motion.div>
  );
}

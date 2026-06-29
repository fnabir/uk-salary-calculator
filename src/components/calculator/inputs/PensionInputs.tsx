// src/components/calculator/inputs/PensionInputs.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, fadeIn, transitions } from "@/lib/animations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Info } from "lucide-react";
import type { PensionType } from "@/lib/tax/calculations/pension";
import { useState } from "react";

interface PensionInputsProps {
  employeeRate: number;
  employerRate: number;
  type: PensionType;
  onEmployeeRateChange: (value: number) => void;
  onEmployerRateChange: (value: number) => void;
  onTypeChange: (value: PensionType) => void;
}

const PENSION_TYPE_INFO: Record<PensionType, string> = {
  salary_sacrifice:
    "Contributions are taken before tax and NI — reduces your taxable income and NI liability. Most tax efficient.",
  relief_at_source:
    "Contributions are taken after tax. HMRC adds basic rate tax relief directly to your pension pot.",
};

function RateInput({
  id,
  label,
  value,
  onChange,
  tooltip,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(raw);
    onChange(isNaN(parsed) ? 0 : Math.min(100, parsed));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`About ${label}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs p-3">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={value === 0 ? "" : value}
          onChange={handleChange}
          className="pr-7"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
          %
        </span>
      </div>
    </div>
  );
}

export function PensionInputs({
  employeeRate,
  employerRate,
  type,
  onEmployeeRateChange,
  onEmployerRateChange,
  onTypeChange,
}: PensionInputsProps) {
  // Enabled state is local — it's purely a UI concern, not a calculation concern
  // When disabled, rates stay in state so they're restored if re-enabled
  const [enabled, setEnabled] = useState(false);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    // Reset rates to 0 when disabling so calculation ignores pension
    if (!checked) {
      onEmployeeRateChange(0);
      onEmployerRateChange(0);
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-4"
      variants={fadeInUp}
      transition={transitions.snappy}
    >
      {/* Header with checkbox */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Pension</Label>

        <div className="flex items-center gap-2">
          <Label htmlFor="pension-enabled" className="text-sm cursor-pointer">
            {enabled ? "Enabled" : "Opted out"}
          </Label>
          <Checkbox
            id="pension-enabled"
            checked={enabled}
            onCheckedChange={handleToggle}
          />
        </div>
      </div>

      {/* Expandable pension fields */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            className="flex flex-col gap-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.smooth}
          >
            {/* Pension type toggle */}
            <div className="flex flex-col gap-1">
              <div className="w-full flex items-center justify-between gap-2">
                <Label className="text-sm">Contribution type</Label>
                <ToggleGroup
                  type="single"
                  value={type}
                  onValueChange={(v) => v && onTypeChange(v as PensionType)}
                >
                  <ToggleGroupItem value="salary_sacrifice" className="text-xs">
                    Salary Sacrifice
                  </ToggleGroupItem>
                  <ToggleGroupItem value="relief_at_source" className="text-xs">
                    Relief at Source
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={type}
                  className="text-xs text-muted-foreground"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transitions.snappy}
                >
                  {PENSION_TYPE_INFO[type]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Rate inputs */}
            <div className="grid grid-cols-2 gap-3">
              <RateInput
                id="employee-rate"
                label="Your contribution"
                value={employeeRate}
                onChange={onEmployeeRateChange}
                tooltip="Your personal contribution as a percentage of qualifying earnings. Auto-enrolment minimum is 5%."
              />
              <RateInput
                id="employer-rate"
                label="Employer contribution"
                value={employerRate}
                onChange={onEmployerRateChange}
                tooltip="Your employer's contribution as a percentage of qualifying earnings. Auto-enrolment minimum is 3%."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

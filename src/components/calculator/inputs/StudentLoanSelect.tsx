"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, fadeIn, transitions } from "@/lib/animations";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, X } from "lucide-react";
import type { StudentLoanPlanType } from "@/lib/tax/calculations/studentLoan";

interface StudentLoanSelectProps {
  selected: StudentLoanPlanType[];
  onChange: (value: StudentLoanPlanType[]) => void;
}

const PLANS: {
  value: StudentLoanPlanType;
  label: string;
  threshold: string;
  description: string;
}[] = [
  {
    value: "plan1",
    label: "Plan 1",
    threshold: "£24,990",
    description:
      "Started uni before September 2012 (England/Wales) or any time in Northern Ireland",
  },
  {
    value: "plan2",
    label: "Plan 2",
    threshold: "£27,295",
    description: "Started uni from September 2012 (England/Wales)",
  },
  {
    value: "plan4",
    label: "Plan 4",
    threshold: "£31,395",
    description: "Studied in Scotland",
  },
  {
    value: "plan5",
    label: "Plan 5",
    threshold: "£25,000",
    description: "Started uni from August 2023 (England)",
  },
  {
    value: "postgrad",
    label: "Postgraduate",
    threshold: "£21,000",
    description: "Postgraduate Master's or Doctoral loan",
  },
];

export function StudentLoanSelect({
  selected,
  onChange,
}: StudentLoanSelectProps) {
  const isNone = selected.includes("none") || selected.length === 0;

  const togglePlan = (plan: StudentLoanPlanType) => {
    if (plan === "none") {
      onChange(["none"]);
      return;
    }

    const withoutNone = selected.filter((p) => p !== "none");

    if (withoutNone.includes(plan)) {
      // Deselect — if nothing left, revert to none
      const updated = withoutNone.filter((p) => p !== plan);
      onChange(updated.length === 0 ? ["none"] : updated);
    } else {
      onChange([...withoutNone, plan]);
    }
  };

  const removePlan = (plan: StudentLoanPlanType) => {
    const updated = selected.filter((p) => p !== plan);
    onChange(updated.length === 0 ? ["none"] : updated);
  };

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={fadeInUp}
      transition={transitions.snappy}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium">Student Loan</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="About student loan repayments"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-60 p-3">
              <p className="text-xs">
                Repayments are 9% of income above the threshold (6% for
                Postgraduate). You can have multiple plans running
                simultaneously — each is calculated independently.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Plan selector */}
      <div className="flex flex-wrap gap-2">
        {/* None option */}
        <button
          type="button"
          onClick={() => togglePlan("none")}
          className={`
            rounded-md border px-3 py-1.5 text-xs font-medium transition-colors
            ${
              isNone
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground"
            }
          `}
        >
          None
        </button>

        {PLANS.map((plan) => {
          const isSelected = selected.includes(plan.value);
          return (
            <TooltipProvider key={plan.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => togglePlan(plan.value)}
                    className={`
                      rounded-md border px-3 py-1.5 text-xs font-medium transition-colors
                      ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground"
                      }
                    `}
                  >
                    {plan.label}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="flex-col max-w-xs p-2">
                  <p className="text-xs font-medium">{plan.label}</p>
                  <p className="text-xs">{plan.description}</p>
                  <p className="text-xs">
                    Threshold:{" "}
                    <span className="font-medium">{plan.threshold}</span>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Selected plans summary */}
      <AnimatePresence>
        {!isNone && (
          <motion.div
            className="flex flex-wrap gap-1.5"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitions.snappy}
          >
            {selected
              .filter((p) => p !== "none")
              .map((plan) => {
                const planInfo = PLANS.find((p) => p.value === plan);
                return (
                  <Badge
                    key={plan}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    {planInfo?.label}
                    <button
                      type="button"
                      onClick={() => removePlan(plan)}
                      aria-label={`Remove ${planInfo?.label}`}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, fadeIn, transitions } from "@/lib/animations";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { StudentLoanPlanType } from "@/lib/tax/calculations/studentLoan";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { TaxYearConfig } from "@/lib/tax/config";
import { formatCurrency } from "@/lib/utils";

interface StudentLoanSelectProps {
  selected: StudentLoanPlanType[];
  onChange: (value: StudentLoanPlanType[]) => void;
  plans: TaxYearConfig["studentLoan"];
}

export function StudentLoanSelect({
  selected,
  onChange,
  plans,
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
        <InfoTooltip
          content={
            <div className="flex flex-col space-y-2">
              <p className="text-xs">
                Repayments are 9% of income above the threshold (6% for
                Postgraduate). You can have multiple plans running
                simultaneously — each is calculated independently.
              </p>
            </div>
          }
          side="right"
        />
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

        {plans.map((plan) => {
          const isSelected = selected.includes(plan.plan);
          return (
            <InfoTooltip
              key={plan.plan}
              button={
                <button
                  type="button"
                  onClick={() => togglePlan(plan.plan)}
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
              }
              content={
                <div className="flex flex-col space-y-2">
                  <p className="text-xs font-medium">{plan.label}</p>
                  <p className="text-xs">{plan.description}</p>
                  <p className="text-xs">
                    Threshold:{" "}
                    <span className="font-medium">
                      {formatCurrency(plan.threshold.annual)}
                    </span>
                  </p>
                </div>
              }
              side="top"
            />
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
                const planInfo = plans.find((p) => p.plan === plan);
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
                      <X className="size-3.5" />
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

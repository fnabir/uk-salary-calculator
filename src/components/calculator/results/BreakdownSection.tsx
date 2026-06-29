// src/components/calculator/results/BreakdownSection.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transitions } from "@/lib/animations";
import { formatCurrency, round } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { useTransform } from "framer-motion";
import type { TakeHomeResult } from "@/lib/tax/calculations";
import type { Period } from "./PeriodToggle";

interface BreakdownSectionProps {
  result: TakeHomeResult;
  period: Period;
}

// Period divisor helper
function divisor(period: Period): number {
  return period === "annual" ? 1 : period === "monthly" ? 12 : 52;
}

// Animated value cell
function AnimatedValue({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const animated = useAnimatedNumber(value);
  const formatted = useTransform(animated, (v) => formatCurrency(v));
  return (
    <motion.span className={`tabular-nums ${className ?? ""}`}>
      {formatted}
    </motion.span>
  );
}

// Single breakdown row
function BreakdownRow({
  label,
  value,
  sub,
  valueClassName,
}: {
  label: string;
  value: number;
  sub?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        <span className="text-sm">{label}</span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      <AnimatedValue value={value} className={valueClassName} />
    </div>
  );
}

// Effective rate row
function EffectiveRateRow({
  label,
  sub,
  rate,
}: {
  label: string;
  sub: string;
  rate: number;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        <span className="text-sm">{label}</span>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
      <span className="text-sm tabular-nums text-muted-foreground">
        {rate}%
      </span>
    </div>
  );
}

// Collapsible section
function CollapsibleBlock({
  title,
  total,
  totalClassName,
  children,
}: {
  title: string;
  total: number;
  totalClassName?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div layout className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between py-2 w-full group"
      >
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={transitions.snappy}
          >
            <ChevronDown className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </motion.div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <AnimatedValue value={total} className={totalClassName} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.smooth}
            className="overflow-hidden pl-7 flex flex-col"
            layout
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main component
export function BreakdownSection({ result, period }: BreakdownSectionProps) {
  const div = divisor(period);

  const hasPension = result.pension.employeeContribution.annual > 0;
  const hasStudentLoan = result.studentLoan.annual.totalRepayment > 0;

  return (
    <motion.div layout className="flex flex-col">
      {/* Gross */}
      <BreakdownRow label="Gross Salary" value={result.salary[period]} />
      <BreakdownRow
        label="Tax Free Allowance"
        value={result.incomeTax[period].personalAllowance}
      />
      <BreakdownRow label="Bonus" value={result.bonus[period]} />
      <BreakdownRow
        label="Taxable Benefits"
        value={result.taxableBenefits[period]}
      />
      <BreakdownRow
        label="Non-Taxable Benefits"
        value={result.nonTaxableBenefits[period]}
      />
      <BreakdownRow
        label="Taxable Income"
        value={result.incomeTax[period].taxableIncome}
      />

      <Separator />

      {/* Income Tax */}
      <CollapsibleBlock
        title="Income Tax"
        total={result.incomeTax[period].incomeTax}
        totalClassName="text-destructive"
      >
        {result.incomeTax[period].bandBreakdown.map((band) => (
          <BreakdownRow
            key={band.label}
            label={band.label}
            sub={`${(band.rate * 100).toFixed(0)}% on ${formatCurrency(band.incomeInBand / div)}`}
            value={band.taxInBand / div}
            valueClassName="text-destructive"
          />
        ))}
        <EffectiveRateRow
          label="Effective Rate"
          sub="Tax as % of gross"
          rate={result.incomeTax[period].effectiveRate}
        />
      </CollapsibleBlock>

      <Separator />

      {/* National Insurance */}
      <CollapsibleBlock
        title="National Insurance"
        total={result.nationalInsurance[period].total}
        totalClassName="text-destructive"
      >
        {result.nationalInsurance[period].bandBreakdown
          .filter((b) => b.rate > 0)
          .map((band, i) => (
            <BreakdownRow
              key={i}
              label={`${(band.rate * 100).toFixed(0)}% rate`}
              sub={`On ${formatCurrency(band.incomeInBand / div)}`}
              value={band.niInBand / div}
              valueClassName="text-destructive"
            />
          ))}
        <EffectiveRateRow
          label="Effective Rate"
          sub="NI as % of gross"
          rate={result.nationalInsurance[period].effectiveRate}
        />
      </CollapsibleBlock>

      {/* Pension */}
      <AnimatePresence>
        {hasPension && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.smooth}
            className="overflow-hidden"
            layout
          >
            <Separator />
            <CollapsibleBlock
              title="Pension"
              total={result.pension.employeeContribution[period]}
              totalClassName="text-amber-500"
            >
              <BreakdownRow
                label="Your contribution"
                value={result.pension.employeeContribution[period]}
                valueClassName="text-amber-500"
              />
              <BreakdownRow
                label="Employer contribution"
                sub="Not deducted from your pay"
                value={result.pension.employerContribution[period]}
                valueClassName="text-muted-foreground"
              />
            </CollapsibleBlock>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Loan */}
      <AnimatePresence>
        {hasStudentLoan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.smooth}
            className="overflow-hidden"
            layout
          >
            <Separator />
            <CollapsibleBlock
              title="Student Loan"
              total={result.studentLoan[period].totalRepayment}
              totalClassName="text-destructive"
            >
              {result.studentLoan[period].planBreakdown.map((plan) => (
                <BreakdownRow
                  key={plan.plan}
                  label={plan.plan
                    .replace("plan", "Plan ")
                    .replace("postgrad", "Postgraduate")}
                  sub={`${(plan.rate * 100).toFixed(0)}% above ${formatCurrency(plan.threshold)}`}
                  value={plan.repayment}
                  valueClassName="text-destructive"
                />
              ))}
            </CollapsibleBlock>
          </motion.div>
        )}
      </AnimatePresence>

      <Separator />

      {/* Net */}
      <div className="flex items-center justify-between py-3">
        <span className="text-sm font-semibold">Take Home Pay</span>
        <AnimatedValue
          value={result.net[period]}
          className="text-lg font-semibold text-primary"
        />
      </div>
    </motion.div>
  );
}

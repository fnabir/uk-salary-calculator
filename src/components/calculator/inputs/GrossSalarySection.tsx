"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transitions } from "@/lib/animations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SalaryInput, SalaryPeriod } from "@/lib/tax/calculations/salary";
import {
  BonusBenefitFrequency,
  BonusBenefitInput,
  BonusBenefitPeriod,
} from "@/lib/tax/calculations/bonusBenefits";

interface GrossSalarySectionProps {
  salary: SalaryInput;
  bonus: BonusBenefitInput;
  taxableBenefits: BonusBenefitInput;
  nonTaxableBenefits: BonusBenefitInput;
  onSalaryChange: (value: SalaryInput) => void;
  onBonusChange: (value: BonusBenefitInput) => void;
  onTaxableBenefitsChange: (value: BonusBenefitInput) => void;
  onNonTaxableBenefitsChange: (value: BonusBenefitInput) => void;
}

// Period select options
const SALARY_PERIODS: { value: SalaryPeriod; label: string }[] = [
  { value: "annual", label: "Annual" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
];

const BONUS_BENEFIT_PERIODS: { value: BonusBenefitPeriod; label: string }[] = [
  { value: "annual", label: "Annual" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
];

const BONUS_BENEFIT_FREQUENCIES: {
  value: BonusBenefitFrequency;
  label: string;
}[] = [
  { value: "regular", label: "Regular" },
  { value: "one-off", label: "One-off" },
];

// Reusable amount input
function AmountInput({
  id,
  value,
  onChange,
  placeholder = "0.00",
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}) {
  const [raw, setRaw] = useState(value === 0 ? "" : String(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
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
    <div className="relative grow">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
        £
      </span>
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={raw}
        onChange={handleChange}
        className="pl-7"
        autoComplete="off"
      />
    </div>
  );
}

// Bonus/Benefit input block
function BonusBenefit({
  id,
  label,
  tooltip,
  value,
  onChange,
}: {
  id: string;
  label: string;
  tooltip: string;
  value: BonusBenefitInput;
  onChange: (value: BonusBenefitInput) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center gap-1.5">
        <div className="w-full flex items-center gap-1.5">
          <Label htmlFor={id} className="text-sm">
            {label}
          </Label>
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
        <RadioGroup
          value={value.frequency}
          onValueChange={(v) =>
            onChange({ ...value, frequency: v as BonusBenefitFrequency })
          }
          className="flex gap-4 justify-end"
        >
          {BONUS_BENEFIT_FREQUENCIES.map((f) => (
            <div key={f.value} className="flex items-center gap-1.5">
              <RadioGroupItem value={f.value} id={`${id}-${f.value}`} />
              <Label htmlFor={`${id}-${f.value}`} className="text-xs">
                {f.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex gap-2">
        <AmountInput
          id={id}
          value={value.amount}
          onChange={(amount) => onChange({ ...value, amount })}
        />
        {value.frequency === "regular" && (
          <Select
            value={value.period}
            onValueChange={(v) =>
              onChange({ ...value, period: v as BonusBenefitPeriod })
            }
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BONUS_BENEFIT_PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value} className="text-xs">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

// Main component
export function GrossSalarySection({
  salary,
  bonus,
  taxableBenefits,
  nonTaxableBenefits,
  onSalaryChange,
  onBonusChange,
  onTaxableBenefitsChange,
  onNonTaxableBenefitsChange,
}: GrossSalarySectionProps) {
  const [showAdditional, setShowAdditional] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Salary amount + period */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="salary" className="capitalize">
          {salary.period} Gross Salary
        </Label>
        <div className="flex gap-2">
          <AmountInput
            id="salary"
            value={salary.amount}
            onChange={(amount) => onSalaryChange({ ...salary, amount })}
          />

          <Select
            value={salary.period}
            onValueChange={(v) =>
              onSalaryChange({ ...salary, period: v as SalaryPeriod })
            }
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SALARY_PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Annual gross preview */}
        {salary.amount > 0 &&
          (salary.period !== "annual" || showAdditional) && (
            <motion.p
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={transitions.snappy}
            >
              {formatCurrency(salary.amount)} annual gross
            </motion.p>
          )}
      </div>

      {/* Additional toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Bonus & Benefits</span>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="show-additional"
            className="text-xs text-muted-foreground cursor-pointer"
          >
            {showAdditional ? "Hide" : "Add"}
          </Label>
          <Checkbox
            id="show-additional"
            checked={showAdditional}
            onCheckedChange={(c) => setShowAdditional(!!c)}
          />
        </div>
      </div>

      {/* Additional fields */}
      <AnimatePresence>
        {showAdditional && (
          <motion.div
            className="flex flex-col gap-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.smooth}
          >
            {/* Bonus */}
            <BonusBenefit
              id="bonus"
              label="Bonus"
              tooltip="A one-off bonus payment. Select the period it applies to — it will be added to your annual gross and shown correctly across all periods."
              value={bonus}
              onChange={onBonusChange}
            />

            {/* Taxable benefits */}
            <BonusBenefit
              id="taxable-benefits"
              label="Taxable Benefits"
              tooltip="Benefits in kind subject to Income Tax — e.g. private medical insurance, company car cash equivalent. Added to your gross before tax is calculated."
              value={taxableBenefits}
              onChange={onTaxableBenefitsChange}
            />

            {/* Non-taxable benefits */}
            <BonusBenefit
              id="non-taxable-benefits"
              label="Non-Taxable Benefits"
              tooltip="Benefits exempt from tax — e.g. cycle to work scheme, childcare vouchers. Shown for reference only and excluded from all tax calculations."
              value={nonTaxableBenefits}
              onChange={onNonTaxableBenefitsChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

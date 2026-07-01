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
import { formatCurrency } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SalaryInput, SalaryPeriod } from "@/lib/tax/calculations/salary";
import {
  BonusBenefitFrequency,
  BonusBenefitInput,
  BonusBenefitPeriod,
} from "@/lib/tax/calculations/bonusBenefits";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

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

const TOOLTIP_CONTENT = {
  bonus: {
    "one-off": (
      <div className="space-y-1.5">
        <p className="font-medium">One-off Bonus</p>
        <p>
          A single bonus payment — e.g. annual performance bonus or signing
          bonus. Added to your gross once and shown in the selected period.
        </p>
      </div>
    ),
    regular: (
      <div className="space-y-1.5">
        <p className="font-medium">Regular Bonus</p>
        <p>
          A recurring bonus paid every period — e.g. monthly commission or
          weekly performance pay. Annualised and included in every period&apos;s
          gross.
        </p>
      </div>
    ),
  },
  taxableBenefits: {
    "one-off": (
      <div className="space-y-1.5">
        <p className="font-medium">One-off Taxable Benefit</p>
        <p>
          A single taxable benefit in kind — e.g. a one-time company car
          allowance or relocation package. Subject to Income Tax and added to
          your gross once.
        </p>
        <p className="text-muted-foreground">
          Examples: relocation allowance, public transport allowance, one-off
          medical cover
        </p>
      </div>
    ),
    regular: (
      <div className="space-y-1.5">
        <p className="font-medium">Regular Taxable Benefit</p>
        <p>
          A recurring benefit in kind subject to Income Tax — added to your
          gross every period before tax is calculated.
        </p>
        <p className="text-muted-foreground">
          Examples: private health insurance, company car cash equivalent, gym
          membership
        </p>
      </div>
    ),
  },
  nonTaxableBenefits: {
    "one-off": (
      <div className="space-y-1.5">
        <p className="font-medium">One-off Non-Taxable Benefit</p>
        <p>
          A single benefit exempt from tax — shown in your gross for reference
          only and excluded from all tax calculations.
        </p>
        <p className="text-muted-foreground">
          Examples: one-off cycle to work equipment, childcare payment
        </p>
      </div>
    ),
    regular: (
      <div className="space-y-1.5">
        <p className="font-medium">Regular Non-Taxable Benefit</p>
        <p>
          A recurring benefit exempt from tax — shown in your gross for
          reference only and excluded from all tax and NI calculations.
        </p>
        <p className="text-muted-foreground">
          Examples: cycle to work scheme, childcare vouchers, workplace parking
        </p>
      </div>
    ),
  },
} as const;

type TooltipField = keyof typeof TOOLTIP_CONTENT;

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
  field,
  value,
  onChange,
}: {
  id: string;
  label: string;
  field: TooltipField;
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
          <InfoTooltip
            content={TOOLTIP_CONTENT[field][value.frequency]}
            side="right"
          />
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
        {salary.amount > 0 && salary.period !== "annual" && (
          <motion.p
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitions.snappy}
          >
            {formatCurrency(
              salary.period === "monthly"
                ? salary.amount * 12
                : salary.period === "weekly"
                  ? salary.amount * 52
                  : salary.amount,
            )}{" "}
            per year
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
              field="bonus"
              value={bonus}
              onChange={onBonusChange}
            />

            {/* Taxable benefits */}
            <BonusBenefit
              id="taxable-benefits"
              label="Taxable Benefits"
              field="taxableBenefits"
              value={taxableBenefits}
              onChange={onTaxableBenefitsChange}
            />

            {/* Non-taxable benefits */}
            <BonusBenefit
              id="non-taxable-benefits"
              label="Non-Taxable Benefits"
              field="nonTaxableBenefits"
              value={nonTaxableBenefits}
              onChange={onNonTaxableBenefitsChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

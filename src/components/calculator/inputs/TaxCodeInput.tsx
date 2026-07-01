"use client";

import { motion } from "framer-motion";
import { fadeInUp, transitions } from "@/lib/animations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface TaxCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TAX_CODE_EXAMPLES = [
  { code: "1257L", description: "Standard (personal allowance of £12,570)" },
  {
    code: "BR",
    description: "Basic rate on all income (no personal allowance)",
  },
  { code: "D0", description: "Higher rate on all income" },
  { code: "NT", description: "No tax" },
  { code: "K100", description: "Negative allowance (extra tax owed)" },
];

export function TaxCodeInput({ value, onChange }: TaxCodeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Uppercase and strip spaces
    onChange(e.target.value.toUpperCase().replace(/\s/g, ""));
  };

  return (
    <motion.div
      className="flex flex-col gap-2"
      variants={fadeInUp}
      transition={transitions.snappy}
    >
      <div className="flex items-center gap-1.5">
        <Label htmlFor="tax-code">Tax Code</Label>
        <InfoTooltip
          content={
            <div className="flex flex-col space-y-2">
              <p className="text-xs font-medium">
                Your tax code is on your payslip or P60. It tells HMRC how much
                personal allowance you get.
              </p>
              <ul className="space-y-1">
                {TAX_CODE_EXAMPLES.map(({ code, description }) => (
                  <li key={code} className="text-xs">
                    <span className="font-mono font-medium">{code}</span> -{" "}
                    {description}
                  </li>
                ))}
              </ul>
              <p className="text-xs">
                Not sure? Leave as{" "}
                <span className="font-mono font-medium">1257L</span> - this is
                the standard code for most people.
              </p>
            </div>
          }
          side="right"
        />
      </div>

      <Input
        id="tax-code"
        type="text"
        placeholder="1257L"
        value={value}
        onChange={handleChange}
        maxLength={8}
        className="font-mono uppercase"
      />
    </motion.div>
  );
}

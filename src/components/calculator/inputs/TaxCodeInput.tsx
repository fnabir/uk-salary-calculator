"use client";

import { motion } from "framer-motion";
import { fadeInUp, transitions } from "@/lib/animations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="What is a tax code?"
                className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="flex flex-col max-w-xs space-y-2 p-3"
            >
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
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

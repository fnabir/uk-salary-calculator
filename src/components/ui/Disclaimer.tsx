import { fadeInUp, transitions } from "@/lib/animations";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="mx-4 mt-4">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={transitions.snappy}
        className="bg-muted rounded-md  mx-auto max-w-6xl px-2 py-2.5 flex items-center gap-2"
      >
        <Info className="size-6 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-muted-foreground text-justify">
          This calculator provides estimates for informational purposes only and
          does not constitute financial, tax, or legal advice. Results are based
          on standard UK tax rules for 2026/27 and may not reflect your
          individual circumstances, including multiple income sources, tax
          reliefs, or HMRC adjustments. For advice specific to your situation,
          consult a qualified tax adviser or visit{" "}
          <a
            href="https://www.gov.uk/income-tax"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            HMRC
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}

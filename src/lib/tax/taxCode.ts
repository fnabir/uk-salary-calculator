import { TaxYearConfig } from "./config";

export type TaxCodeResult =
  | { type: "STANDARD"; personalAllowance: number }
  | { type: "FLAT_RATE"; rate: number } // BR, D0, D1
  | { type: "NO_TAX" } // NT
  | { type: "NO_ALLOWANCE" } // 0T
  | { type: "K_CODE"; reduction: number }; // K codes

export function parseTaxCode(code: string): TaxCodeResult {
  const normalised = code
    .trim()
    .toUpperCase()
    .replace(/[WM]1$/, ""); // strip emergency suffix

  if (normalised === "NT") return { type: "NO_TAX" };
  if (normalised === "0T") return { type: "NO_ALLOWANCE" };
  if (normalised === "BR") return { type: "FLAT_RATE", rate: 0.2 };
  if (normalised === "D0") return { type: "FLAT_RATE", rate: 0.4 };
  if (normalised === "D1") return { type: "FLAT_RATE", rate: 0.45 };

  // K code — negative allowance
  const kMatch = normalised.match(/^K(\d+)$/);
  if (kMatch) return { type: "K_CODE", reduction: parseInt(kMatch[1]) * 10 };

  // Standard L, M, N codes — e.g. 1257L
  const standardMatch = normalised.match(/^(\d+)[LMN]$/);
  if (standardMatch) {
    return {
      type: "STANDARD",
      personalAllowance: parseInt(standardMatch[1]) * 10,
    };
  }

  // Fallback — treat as standard allowance
  return { type: "STANDARD", personalAllowance: 12570 };
}

export function resolvePersonalAllowance(
  code: string,
  grossSalary: { annual: number; monthly: number; weekly: number },
  config: TaxYearConfig,
): {
  personalAllowance: { annual: number; monthly: number; weekly: number };
  flatRate: number | null;
  noTax: boolean;
} {
  const parsed = parseTaxCode(code);

  switch (parsed.type) {
    case "NO_TAX":
      return {
        personalAllowance: { annual: 0, monthly: 0, weekly: 0 },
        flatRate: null,
        noTax: true,
      };

    case "FLAT_RATE":
      return {
        personalAllowance: { annual: 0, monthly: 0, weekly: 0 },
        flatRate: parsed.rate,
        noTax: false,
      };

    case "NO_ALLOWANCE":
      return {
        personalAllowance: { annual: 0, monthly: 0, weekly: 0 },
        flatRate: null,
        noTax: false,
      };

    case "K_CODE":
      // K code reduces allowance — can result in negative (extra taxable amount)
      const annual = -parsed.reduction;
      return {
        personalAllowance: {
          annual,
          monthly: annual / 12,
          weekly: annual / 52,
        },
        flatRate: null,
        noTax: false,
      };

    case "STANDARD": {
      // Still apply the £100k taper on top of the tax-code allowance
      const basePA = parsed.personalAllowance;

      // Compute estimated annual income for each period
      const estimatedAnnual = {
        annual: grossSalary.annual,
        monthly: grossSalary.monthly * 12,
        weekly: grossSalary.weekly * 52,
      };

      const computePA = (annualEstimate: number) => {
        let pa = basePA;
        if (annualEstimate > config.personalAllowanceTaperThreshold) {
          const excess =
            annualEstimate - config.personalAllowanceTaperThreshold;
          pa = Math.max(0, pa - Math.floor(excess / 2));
        }
        return pa;
      };

      const annualPA = computePA(estimatedAnnual.annual);
      const monthlyPA = computePA(estimatedAnnual.monthly) / 12;
      const weeklyPA = computePA(estimatedAnnual.weekly) / 52;

      return {
        personalAllowance: {
          annual: annualPA,
          monthly: monthlyPA,
          weekly: weeklyPA,
        },
        flatRate: null,
        noTax: false,
      };
    }
  }
}

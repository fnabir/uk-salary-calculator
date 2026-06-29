import type { TaxBand, TaxYearConfig } from "../config";
import { resolvePersonalAllowance } from "../taxCode";

export interface IncomeTaxInput {
  adjustedGross: { annual: number; monthly: number; weekly: number }; // after salary sacrifice if applicable
  taxCode: string; // e.g. "1257L"
  region: "uk" | "scotland";
  config: TaxYearConfig;
}

export interface IncomeTaxPeriodResult {
  personalAllowance: number;
  taxableIncome: number;
  incomeTax: number;
  effectiveRate: number;
  bandBreakdown: BandBreakdown[];
}

export interface IncomeTaxResult {
  annual: IncomeTaxPeriodResult;
  monthly: IncomeTaxPeriodResult;
  weekly: IncomeTaxPeriodResult;
}

export interface BandBreakdown {
  label: string;
  rate: number;
  incomeInBand: number;
  taxInBand: number;
}

function calculateTaxOnBands(
  taxableIncome: number,
  bands: TaxBand[],
): { tax: number; breakdown: BandBreakdown[] } {
  let tax = 0;
  const breakdown: BandBreakdown[] = [];

  for (const band of bands) {
    if (taxableIncome <= band.from) break;

    const bandTop = band.to ?? Infinity;
    const incomeInBand = Math.min(taxableIncome, bandTop) - band.from;
    const taxInBand = incomeInBand * band.rate;

    tax += taxInBand;
    breakdown.push({
      label: band.label,
      rate: band.rate,
      incomeInBand,
      taxInBand,
    });
  }

  return { tax, breakdown };
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const { adjustedGross, taxCode, region, config } = input;

  // Get PA, flatRate, noTax for ALL periods
  const { personalAllowance, flatRate, noTax } = resolvePersonalAllowance(
    taxCode,
    {
      annual: adjustedGross.annual,
      monthly: adjustedGross.monthly,
      weekly: adjustedGross.weekly,
    },
    config,
  );

  const calculate = (gross: number, pa: number): IncomeTaxPeriodResult => {
    const taxableIncome = Math.max(0, gross - pa);

    // NT — No tax at all
    if (noTax) {
      return {
        personalAllowance: pa,
        taxableIncome: 0,
        incomeTax: 0,
        effectiveRate: 0,
        bandBreakdown: [],
      };
    }

    // Flat rate codes — BR, D0, D1
    if (flatRate !== null) {
      const incomeTax = gross * flatRate;
      return {
        personalAllowance: pa,
        taxableIncome: gross,
        incomeTax,
        effectiveRate: flatRate * 100,
        bandBreakdown: [
          {
            label: `Flat Rate (${flatRate * 100}%)`,
            rate: flatRate,
            incomeInBand: gross,
            taxInBand: incomeTax,
          },
        ],
      };
    }

    // Standard PAYE banding
    const bands =
      region === "scotland" ? config.incomeTax.scotland : config.incomeTax.uk;

    const { tax: incomeTax, breakdown: bandBreakdown } = calculateTaxOnBands(
      taxableIncome,
      bands,
    );

    const effectiveRate =
      gross > 0 ? parseFloat(((incomeTax / gross) * 100).toFixed(2)) : 0;

    return {
      personalAllowance: pa,
      taxableIncome,
      incomeTax,
      effectiveRate,
      bandBreakdown,
    };
  };

  return {
    annual: calculate(adjustedGross.annual, personalAllowance.annual),
    monthly: calculate(adjustedGross.monthly, personalAllowance.monthly),
    weekly: calculate(adjustedGross.weekly, personalAllowance.weekly),
  };
}

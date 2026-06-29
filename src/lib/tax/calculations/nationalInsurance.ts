import type { NiBand } from "../config";

export type NiPeriod = "annual" | "monthly" | "weekly";

export interface NationalInsuranceInput {
  adjustedGross: { annual: number; monthly: number; weekly: number };
  config: { ni: NiBand[] };
}

export interface NiBandBreakdown {
  rate: number;
  incomeInBand: number;
  niInBand: number;
}

export interface NationalInsurancePeriodResult {
  total: number;
  effectiveRate: number;
  bandBreakdown: NiBandBreakdown[];
}

export interface NationalInsuranceResult {
  annual: NationalInsurancePeriodResult;
  monthly: NationalInsurancePeriodResult;
  weekly: NationalInsurancePeriodResult;
}

export function calculateNationalInsurance(
  input: NationalInsuranceInput,
): NationalInsuranceResult {
  const { adjustedGross, config } = input;

  const periods: NiPeriod[] = ["annual", "monthly", "weekly"];
  const result = {} as NationalInsuranceResult;

  for (const period of periods) {
    let total = 0;
    const bandBreakdown: NiBandBreakdown[] = [];

    for (const band of config.ni) {
      const from = band.from[period];
      const to = band.to ? band.to[period] : null;

      if (adjustedGross[period] <= from) break;

      const bandTop = to ?? Infinity;
      const incomeInBand = Math.min(adjustedGross[period], bandTop) - from;
      const niInBand = incomeInBand * band.rate;

      total += niInBand;
      bandBreakdown.push({ rate: band.rate, incomeInBand, niInBand });
    }

    const effectiveRate =
      adjustedGross[period] > 0
        ? parseFloat(((total / adjustedGross[period]) * 100).toFixed(2))
        : 0;

    result[period] = { total, effectiveRate, bandBreakdown };
  }

  return result;
}

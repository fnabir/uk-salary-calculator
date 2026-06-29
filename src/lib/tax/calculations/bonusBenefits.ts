import { toPeriod } from "./salary";

export type BonusBenefitFrequency = "one-off" | "regular";
export type BonusBenefitPeriod = "annual" | "monthly" | "weekly";

export interface BonusBenefitInput {
  amount: number;
  frequency: BonusBenefitFrequency;
  period: BonusBenefitPeriod;
}

export interface BonusBenefitResult {
  annual: number;
  monthly: number;
  weekly: number;
}

export function calculateBonusBenefit(
  input: BonusBenefitInput,
): BonusBenefitResult {
  const { amount, frequency, period } = input;

  if (frequency === "one-off") {
    return {
      annual: amount,
      monthly: amount,
      weekly: amount,
    };
  }

  return toPeriod(amount, period);
}

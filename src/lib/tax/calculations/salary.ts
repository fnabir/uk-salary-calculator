export type SalaryPeriod = "annual" | "monthly" | "weekly";

export interface SalaryInput {
  amount: number;
  period: SalaryPeriod;
}

export interface SalaryResult {
  annual: number;
  monthly: number;
  weekly: number;
}

export function toPeriod(
  amount: number,
  period: "annual" | "monthly" | "weekly",
): { annual: number; monthly: number; weekly: number } {
  return {
    annual:
      period === "annual"
        ? amount
        : period === "monthly"
          ? amount * 12
          : amount * 52,
    monthly:
      period === "monthly"
        ? amount
        : period === "annual"
          ? amount / 12
          : (amount * 52) / 12,
    weekly:
      period === "weekly"
        ? amount
        : period === "annual"
          ? amount / 52
          : (amount * 12) / 52,
  };
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const { amount, period } = input;

  return toPeriod(amount, period);
}

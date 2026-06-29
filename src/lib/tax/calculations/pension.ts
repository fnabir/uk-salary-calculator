export type PensionType = "salary_sacrifice" | "relief_at_source";

export interface PensionInput {
  grossSalary: { annual: number; monthly: number; weekly: number };
  employeeRate: number; // e.g. 0.05 for 5%
  employerRate: number; // e.g. 0.03 for 3%
  type: PensionType;
  lowerThreshold: number; // £6,240 — from config
  upperThreshold: number; // £50,270 — from config
}

export interface PensionResult {
  employeeContribution: { annual: number; monthly: number; weekly: number };
  employerContribution: { annual: number; monthly: number; weekly: number };
  adjustedGross: { annual: number; monthly: number; weekly: number };
}

export function calculatePension(input: PensionInput): PensionResult {
  const {
    grossSalary,
    employeeRate,
    employerRate,
    type,
    lowerThreshold,
    upperThreshold,
  } = input;

  // Qualifying earnings — pension contributions apply on this band only
  const qualifyingEarnings = Math.max(
    0,
    Math.min(grossSalary.annual, upperThreshold) - lowerThreshold,
  );

  const employeeContribution = {
    annual: qualifyingEarnings * employeeRate,
    monthly: (qualifyingEarnings * employeeRate) / 12,
    weekly: (qualifyingEarnings * employeeRate) / 52,
  };
  const employerContribution = {
    annual: qualifyingEarnings * employerRate,
    monthly: (qualifyingEarnings * employerRate) / 12,
    weekly: (qualifyingEarnings * employerRate) / 52,
  };

  // Salary sacrifice reduces gross before tax and NI
  // Relief at source does NOT — HMRC adds basic rate tax relief directly to pension pot
  const adjustedGross =
    type === "salary_sacrifice"
      ? {
          annual: grossSalary.annual - employeeContribution.annual,
          monthly: grossSalary.monthly - employeeContribution.monthly,
          weekly: grossSalary.weekly - employeeContribution.weekly,
        }
      : grossSalary;

  return {
    employeeContribution,
    employerContribution,
    adjustedGross,
  };
}

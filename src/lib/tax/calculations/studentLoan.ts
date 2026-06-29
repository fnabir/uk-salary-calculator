import { round } from "@/lib/utils";
import type { StudentLoanPlan } from "../config";

export type StudentLoanPlanType =
  | "none"
  | "plan1"
  | "plan2"
  | "plan4"
  | "plan5"
  | "postgrad";

export type StudentLoanPeriod = "annual" | "monthly" | "weekly";

export interface StudentLoanInput {
  income: { annual: number; monthly: number; weekly: number };
  plans: StudentLoanPlanType[]; // user can have multiple e.g. plan2 + postgrad
  config: { studentLoan: StudentLoanPlan[] };
}

export interface StudentLoanPlanBreakdown {
  plan: StudentLoanPlanType;
  rate: number;
  threshold: number;
  repayment: number;
}

export interface StudentLoanPeriodResult {
  totalRepayment: number;
  planBreakdown: StudentLoanPlanBreakdown[];
}

export interface StudentLoanResult {
  annual: StudentLoanPeriodResult;
  monthly: StudentLoanPeriodResult;
  weekly: StudentLoanPeriodResult;
}

export function calculateStudentLoan(
  input: StudentLoanInput,
): StudentLoanResult {
  const { income, plans, config } = input;

  if (plans.includes("none") || plans.length === 0) {
    return {
      annual: { totalRepayment: 0, planBreakdown: [] },
      monthly: { totalRepayment: 0, planBreakdown: [] },
      weekly: { totalRepayment: 0, planBreakdown: [] },
    };
  }

  const result = {} as StudentLoanResult;
  const periods: StudentLoanPeriod[] = ["annual", "monthly", "weekly"];

  for (const period of periods) {
    let totalRepayment = 0;
    const planBreakdown: StudentLoanPlanBreakdown[] = [];

    for (const planType of plans) {
      if (planType === "none") continue;

      const planConfig = config.studentLoan.find((p) => p.plan === planType);
      if (!planConfig) continue;

      const threshold = planConfig.threshold[period];
      const repayment = round(
        Math.max(0, income[period] - threshold) * planConfig.rate,
      );

      totalRepayment += repayment;
      planBreakdown.push({
        plan: planType,
        rate: planConfig.rate,
        threshold,
        repayment,
      });
    }

    result[period] = { totalRepayment, planBreakdown };
  }

  return result;
}

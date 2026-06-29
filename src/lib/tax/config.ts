export type TaxYear = "2026-27"; // will be extended to future years as needed (e.g. "2027-28", etc.)
export type Region = "uk" | "scotland";

export interface TaxBand {
  label: string;
  rate: number; // e.g. 0.20
  from: number; // annual income
  to: number | null; // null = no upper limit
}

export interface NiBand {
  rate: number;
  from: { annual: number; monthly: number; weekly: number };
  to: { annual: number; monthly: number; weekly: number } | null;
}

export interface StudentLoanPlan {
  plan: "plan1" | "plan2" | "plan4" | "plan5" | "postgrad";
  rate: number;
  threshold: { annual: number; monthly: number; weekly: number };
}

export interface TaxYearConfig {
  personalAllowance: number;
  personalAllowanceTaperThreshold: number; // £100,000
  personalAllowanceTaperEnd: number; // £125,140
  incomeTax: {
    uk: TaxBand[];
    scotland: TaxBand[];
  };
  ni: NiBand[];
  studentLoan: StudentLoanPlan[];
  pension: {
    autoEnrolmentLower: number; // £6,240
    autoEnrolmentUpper: number; // £50,270
    employeeMinRate: number; // 0.05
    employerMinRate: number; // 0.03
  };
}

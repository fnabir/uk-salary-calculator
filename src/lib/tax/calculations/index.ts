import { calculatePension, type PensionResult } from "./pension";
import { calculateIncomeTax, IncomeTaxResult } from "./incomeTax";
import {
  calculateNationalInsurance,
  NationalInsuranceResult,
} from "./nationalInsurance";
import { calculateStudentLoan } from "./studentLoan";
import type { TaxYearConfig } from "../config";
import type { StudentLoanPlanType, StudentLoanResult } from "./studentLoan";
import type { PensionType } from "./pension";
import { round } from "@/lib/utils";
import {
  BonusBenefitInput,
  BonusBenefitResult,
  calculateBonusBenefit,
} from "./bonusBenefits";
import { calculateSalary, SalaryInput, SalaryResult } from "./salary";

export interface TakeHomeInput {
  salaryInput: SalaryInput;
  bonusInput: BonusBenefitInput;
  taxableBenefitsInput: BonusBenefitInput;
  nonTaxableBenefitsInput: BonusBenefitInput;
  taxCode: string; // default "1257L"
  region: "uk" | "scotland";
  taxYear: string; // e.g. "2026-27"
  pensionInput: {
    employeeRate: number; // e.g. 0.05
    employerRate: number; // e.g. 0.03
    type: PensionType;
  };
  studentLoanPlans: StudentLoanPlanType[];
  config: TaxYearConfig;
}

export interface TakeHomeResult {
  gross: { annual: number; monthly: number; weekly: number };
  totalDeductions: { annual: number; monthly: number; weekly: number };
  net: { annual: number; monthly: number; weekly: number };
  salary: SalaryResult;
  bonus: BonusBenefitResult;
  taxableBenefits: BonusBenefitResult;
  nonTaxableBenefits: BonusBenefitResult;
  pension: PensionResult;
  incomeTax: IncomeTaxResult;
  nationalInsurance: NationalInsuranceResult;
  studentLoan: StudentLoanResult;
}

export interface TakeHomePeriod {
  gross: number;
  salary: number;
  bonus: number;
  taxable: number;
  nonTaxable: number;
  personalAllowance: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  pensionEmployee: number;
  totalDeductions: number;
  net: number;
}

export function calculateTakeHome(input: TakeHomeInput): TakeHomeResult {
  const {
    salaryInput,
    bonusInput,
    taxableBenefitsInput,
    nonTaxableBenefitsInput,
    taxCode,
    region,
    pensionInput,
    studentLoanPlans,
    config,
  } = input;

  const salary = calculateSalary(salaryInput);
  const bonus = calculateBonusBenefit(bonusInput);
  const taxableBenefits = calculateBonusBenefit(taxableBenefitsInput);
  const nonTaxableBenefits = calculateBonusBenefit(nonTaxableBenefitsInput);

  const grossTaxablePay = {
    annual: salary.annual + bonus.annual + taxableBenefits.annual,
    monthly: salary.monthly + bonus.monthly + taxableBenefits.monthly,
    weekly: salary.weekly + bonus.weekly + taxableBenefits.weekly,
  };

  // Pension
  // Must run first — salary sacrifice reduces gross before everything else
  const pension = calculatePension({
    grossSalary: grossTaxablePay,
    employeeRate: pensionInput.employeeRate,
    employerRate: pensionInput.employerRate,
    type: pensionInput.type,
    lowerThreshold: config.pension.autoEnrolmentLower,
    upperThreshold: config.pension.autoEnrolmentUpper,
  });

  // Income Tax
  // Uses adjustedGross — reduced by salary sacrifice if applicable
  const incomeTax = calculateIncomeTax({
    adjustedGross: pension.adjustedGross,
    taxCode,
    region,
    config,
  });

  // National Insurance
  // Uses adjustedGross — salary sacrifice reduces NI liability too
  const nationalInsurance = calculateNationalInsurance({
    adjustedGross: pension.adjustedGross,
    config,
  });

  // Student Loan
  // Salary sacrifice reduces student loan income
  // Relief at source does not — student loan sees full gross
  const studentLoan = calculateStudentLoan({
    income:
      pensionInput.type === "salary_sacrifice"
        ? pension.adjustedGross
        : grossTaxablePay,
    plans: studentLoanPlans,
    config,
  });

  const gross = {
    annual: round(grossTaxablePay.annual) + nonTaxableBenefits.annual,
    monthly: round(grossTaxablePay.monthly) + nonTaxableBenefits.monthly,
    weekly: round(grossTaxablePay.weekly) + nonTaxableBenefits.weekly,
  };

  const totalDeductions = {
    annual:
      incomeTax.annual.incomeTax +
      nationalInsurance.annual.total +
      studentLoan.annual.totalRepayment +
      pension.employeeContribution.annual,
    monthly:
      incomeTax.monthly.incomeTax +
      nationalInsurance.monthly.total +
      studentLoan.monthly.totalRepayment +
      pension.employeeContribution.monthly,
    weekly:
      incomeTax.weekly.incomeTax +
      nationalInsurance.weekly.total +
      studentLoan.weekly.totalRepayment +
      pension.employeeContribution.weekly,
  };

  const net = {
    annual: gross.annual - totalDeductions.annual,
    monthly: gross.monthly - totalDeductions.monthly,
    weekly: gross.weekly - totalDeductions.weekly,
  };

  return {
    gross,
    totalDeductions,
    net,
    salary,
    bonus,
    taxableBenefits,
    nonTaxableBenefits,
    pension,
    incomeTax,
    nationalInsurance,
    studentLoan,
  };
}

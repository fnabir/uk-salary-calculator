"use client";

import { useState, useMemo, useCallback } from "react";
import {
  calculateTakeHome,
  type TakeHomeInput,
  type TakeHomeResult,
} from "@/lib/tax/calculations";
import type { TaxYear } from "@/lib/tax/config";
import { TAX_CONFIGS } from "@/lib/tax";
import type { Region } from "@/lib/tax/config";
import type { PensionType } from "@/lib/tax/calculations/pension";
import type { StudentLoanPlanType } from "@/lib/tax/calculations/studentLoan";
import { BonusBenefitInput } from "@/lib/tax/calculations/bonusBenefits";
import { SalaryInput } from "@/lib/tax/calculations/salary";

export interface PeriodBreakdown {
  gross: number;
  displayGross: number;
  salary: number;
  bonus: number;
  taxable: number;
  nonTaxable: number;
}

export interface AllPeriodBreakdown {
  annual: PeriodBreakdown;
  monthly: PeriodBreakdown;
  weekly: PeriodBreakdown;
}

export interface CalculatorState {
  salary: SalaryInput;
  bonus: BonusBenefitInput;
  taxableBenefits: BonusBenefitInput;
  nonTaxableBenefits: BonusBenefitInput;
  taxCode: string;
  region: Region;
  taxYear: TaxYear;
  pension: {
    employeeRate: number;
    employerRate: number;
    type: PensionType;
  };
  studentLoanPlans: StudentLoanPlanType[];
}

const DEFAULT_STATE: CalculatorState = {
  salary: {
    amount: 0,
    period: "annual",
  },
  bonus: {
    amount: 0,
    frequency: "one-off",
    period: "monthly",
  },
  taxableBenefits: {
    amount: 0,
    frequency: "regular",
    period: "monthly",
  },
  nonTaxableBenefits: {
    amount: 0,
    frequency: "regular",
    period: "monthly",
  },
  taxCode: "1257L",
  region: "uk",
  taxYear: "2026-27",
  pension: {
    employeeRate: 0,
    employerRate: 0,
    type: "salary_sacrifice",
  },
  studentLoanPlans: ["none"],
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);

  // Salary updaters
  const setSalary = useCallback((salary: SalaryInput) => {
    setState((prev) => ({
      ...prev,
      salary,
    }));
  }, []);

  // Bonus & Benefit updaters
  const setBonus = useCallback((bonus: BonusBenefitInput) => {
    setState((prev) => ({ ...prev, bonus }));
  }, []);

  const setTaxableBenefits = useCallback(
    (taxableBenefits: BonusBenefitInput) => {
      setState((prev) => ({ ...prev, taxableBenefits }));
    },
    [],
  );

  const setNonTaxableBenefits = useCallback(
    (nonTaxableBenefits: BonusBenefitInput) => {
      setState((prev) => ({ ...prev, nonTaxableBenefits }));
    },
    [],
  );

  // Other updaters
  const setTaxCode = useCallback((taxCode: string) => {
    setState((prev) => ({ ...prev, taxCode }));
  }, []);

  const setRegion = useCallback((region: Region) => {
    setState((prev) => ({ ...prev, region }));
  }, []);

  const setTaxYear = useCallback((taxYear: TaxYear) => {
    setState((prev) => ({ ...prev, taxYear }));
  }, []);

  const setPensionEmployeeRate = useCallback((employeeRate: number) => {
    setState((prev) => ({
      ...prev,
      pension: { ...prev.pension, employeeRate },
    }));
  }, []);

  const setPensionEmployerRate = useCallback((employerRate: number) => {
    setState((prev) => ({
      ...prev,
      pension: { ...prev.pension, employerRate },
    }));
  }, []);

  const setPensionType = useCallback((type: PensionType) => {
    setState((prev) => ({
      ...prev,
      pension: { ...prev.pension, type },
    }));
  }, []);

  const setStudentLoanPlans = useCallback(
    (studentLoanPlans: StudentLoanPlanType[]) => {
      setState((prev) => ({ ...prev, studentLoanPlans }));
    },
    [],
  );

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  // Calculation
  const result = useMemo((): TakeHomeResult | null => {
    if (state.salary.amount <= 0) return null;

    const config = TAX_CONFIGS[state.taxYear];
    if (!config) return null;

    const input: TakeHomeInput = {
      salaryInput: state.salary,
      bonusInput: state.bonus,
      taxableBenefitsInput: state.taxableBenefits,
      nonTaxableBenefitsInput: state.nonTaxableBenefits,
      taxCode: state.taxCode || "1257L",
      region: state.region,
      taxYear: state.taxYear,
      pensionInput: {
        employeeRate: state.pension.employeeRate / 100,
        employerRate: state.pension.employerRate / 100,
        type: state.pension.type,
      },
      studentLoanPlans: state.studentLoanPlans,
      config,
    };

    return calculateTakeHome(input);
  }, [state]);

  return {
    state,
    result,
    setSalary,
    setBonus,
    setTaxableBenefits,
    setNonTaxableBenefits,
    setTaxCode,
    setRegion,
    setTaxYear,
    setPensionEmployeeRate,
    setPensionEmployerRate,
    setPensionType,
    setStudentLoanPlans,
    reset,
  };
}

import { calculateTakeHome } from "../index";
import { config2026_27 } from "../../years/2026-2027";
import { round } from "@/lib/utils";

// Shared defaults
const noBonus = {
  amount: 0,
  frequency: "one-off" as const,
  period: "monthly" as const,
};

const noSalaryInput = (amount: number) => ({
  amount,
  period: "annual" as const,
});

const defaults = {
  taxCode: "1257L",
  region: "uk" as const,
  taxYear: "2026-27",
  pensionInput: {
    employeeRate: 0,
    employerRate: 0,
    type: "relief_at_source" as const,
  },
  bonusInput: noBonus,
  taxableBenefitsInput: noBonus,
  nonTaxableBenefitsInput: noBonus,
  studentLoanPlans: ["none" as const],
  config: config2026_27,
};

const makeInput = (grossSalary: number, overrides = {}) => ({
  ...defaults,
  salaryInput: noSalaryInput(grossSalary),
  ...overrides,
});

// ─── Basic rate taxpayer — £30,000 ────────────────────────────────────
describe("Basic rate taxpayer — £30,000", () => {
  const result = calculateTakeHome(makeInput(30000));

  it("calculates annual income tax correctly", () => {
    // Taxable income: £30,000 - £12,570 = £17,430
    // Tax: £17,430 × 20% = £3,486
    expect(result.incomeTax.annual.incomeTax).toBe(3486);
  });

  it("calculates annual NI correctly", () => {
    // NI: (£30,000 - £12,570) × 8% = £17,430 × 8% = £1,394.40
    expect(result.nationalInsurance.annual.total).toBe(1394.4);
  });

  it("calculates annual net correctly", () => {
    // £30,000 - £3,486 - £1,394.40 = £25,119.60
    expect(result.net.annual).toBe(25119.6);
  });

  it("calculates monthly net correctly", () => {
    expect(result.net.monthly).toBe(2093.34);
  });

  it("calculates weekly net correctly", () => {
    expect(round(result.net.weekly)).toBe(483.09);
  });

  it("monthly income tax is annual divided by 12", () => {
    expect(result.incomeTax.monthly.incomeTax).toBe(
      round(result.incomeTax.annual.incomeTax / 12),
    );
  });

  it("has correct personal allowance", () => {
    expect(result.incomeTax.annual.personalAllowance).toBe(12570);
  });

  it("has correct taxable income", () => {
    expect(result.incomeTax.annual.taxableIncome).toBe(17430);
  });
});

// Higher rate taxpayer — £60,000
describe("Higher rate taxpayer — £60,000", () => {
  const result = calculateTakeHome(makeInput(60000));

  it("calculates annual income tax correctly", () => {
    // Basic rate:  £37,700 × 20% = £7,540
    // Higher rate: £9,730 × 40% = £3,892
    // Total: £11,432
    expect(result.incomeTax.annual.incomeTax).toBe(11432);
  });

  it("calculates annual NI correctly", () => {
    // Main rate:  (£50,270 - £12,570) × 8% = £3,016
    // Upper rate: (£60,000 - £50,270) × 2% = £194.60
    // Total: £3,210.60
    expect(result.nationalInsurance.annual.total).toBe(3210.6);
  });

  it("calculates annual net correctly", () => {
    expect(result.net.annual).toBe(round(60000 - 11432 - 3210.6));
  });

  it("has two income tax bands in breakdown", () => {
    expect(result.incomeTax.annual.bandBreakdown.length).toBe(2);
  });
});

// Additional rate taxpayer — £150,000
describe("Additional rate taxpayer — £150,000", () => {
  const result = calculateTakeHome(makeInput(150000));

  it("has zero personal allowance — fully tapered", () => {
    expect(result.incomeTax.annual.personalAllowance).toBe(0);
  });

  it("has three income tax bands in breakdown", () => {
    expect(result.incomeTax.annual.bandBreakdown.length).toBe(3);
  });

  it("calculates additional rate band tax correctly", () => {
    // Additional rate: (£150,000 - £125,140) × 45% = £24,860 × 45% = £11,187
    const additionalBand = result.incomeTax.annual.bandBreakdown[2];
    expect(round(additionalBand.taxInBand)).toBe(11187);
  });
});

// Personal allowance taper — £110,000
describe("Personal allowance taper — £110,000", () => {
  const result = calculateTakeHome(makeInput(110000));

  it("tapers personal allowance correctly", () => {
    // Excess over £100,000: £10,000 → taper: £5,000
    // Adjusted PA: £12,570 - £5,000 = £7,570
    expect(result.incomeTax.annual.personalAllowance).toBe(7570);
  });

  it("calculates taxable income on tapered PA", () => {
    expect(result.incomeTax.annual.taxableIncome).toBe(110000 - 7570);
  });
});

// Personal allowance fully tapered — £125,140
describe("Personal allowance fully tapered — £125,140", () => {
  const result = calculateTakeHome(makeInput(125140));

  it("personal allowance is zero", () => {
    expect(result.incomeTax.annual.personalAllowance).toBe(0);
  });

  it("taxable income equals gross", () => {
    expect(result.incomeTax.annual.taxableIncome).toBe(125140);
  });
});

// Salary sacrifice pension — £40,000 at 5%
describe("Salary sacrifice pension — £40,000 at 5%", () => {
  const result = calculateTakeHome(
    makeInput(40000, {
      pensionInput: {
        employeeRate: 0.05,
        employerRate: 0.03,
        type: "salary_sacrifice",
      },
    }),
  );

  it("calculates employee contribution correctly", () => {
    // Qualifying earnings: £40,000 - £6,240 = £33,760
    // Employee contribution: £33,760 × 5% = £1,688
    expect(result.pension.employeeContribution.annual).toBe(1688);
  });

  it("reduces adjusted gross correctly", () => {
    // Adjusted gross: £40,000 - £1,688 = £38,312
    expect(result.pension.adjustedGross.annual).toBe(38312);
  });

  it("calculates income tax on adjusted gross not original", () => {
    // Taxable income: £38,312 - £12,570 = £25,742
    // Tax: £25,742 × 20% = £5,148.40
    expect(round(result.incomeTax.annual.incomeTax)).toBe(round(25742 * 0.2));
  });

  it("calculates NI on adjusted gross", () => {
    expect(result.nationalInsurance.annual.total).toBeLessThan(
      calculateTakeHome(makeInput(40000)).nationalInsurance.annual.total,
    );
  });

  it("calculates employer contribution correctly", () => {
    // Employer: £33,760 × 3% = £1,012.80
    expect(result.pension.employerContribution.annual).toBe(1012.8);
  });

  it("calculates monthly employee contribution correctly", () => {
    expect(round(result.pension.employeeContribution.monthly)).toBe(
      round(1688 / 12),
    );
  });
});

// Relief at source pension — £40,000 at 5%
describe("Relief at source pension — £40,000 at 5%", () => {
  const result = calculateTakeHome(
    makeInput(40000, {
      pensionInput: {
        employeeRate: 0.05,
        employerRate: 0.03,
        type: "relief_at_source",
      },
    }),
  );

  it("does not reduce adjusted gross", () => {
    expect(result.pension.adjustedGross.annual).toBe(40000);
  });

  it("calculates income tax on full gross", () => {
    const taxableIncome = 40000 - 12570;
    expect(round(result.incomeTax.annual.incomeTax)).toBe(
      round(taxableIncome * 0.2),
    );
  });
});

// Student loan plan 2 — £35,000
describe("Student loan plan 2 — £35,000", () => {
  const result = calculateTakeHome(
    makeInput(35000, { studentLoanPlans: ["plan2"] }),
  );

  it("calculates annual plan 2 repayment correctly", () => {
    // (£35,000 - £29,385) × 9% = £505.35
    expect(result.studentLoan.annual.totalRepayment).toBe(505.35);
  });

  it("calculates monthly plan 2 repayment using monthly threshold", () => {
    // Monthly income: £35,000 / 12 = £2,916.67
    // Monthly threshold plan 2: £2,448
    // Repayment: (£2,916.67 - £2,448) × 9% = £42.15
    const monthlyIncome = round(35000 / 12);
    const expected = round((monthlyIncome - 2448) * 0.09);
    expect(result.studentLoan.monthly.totalRepayment).toBe(expected);
  });

  it("calculates weekly plan 2 repayment using weekly threshold", () => {
    // Weekly income: £35,000 / 52 = £673.08
    // Weekly threshold plan 2: £565
    // Repayment: (£673.08 - £565) × 9% = £9.73
    const weeklyIncome = round(35000 / 52);
    const expected = round((weeklyIncome - 565) * 0.09);
    expect(result.studentLoan.weekly.totalRepayment).toBe(expected);
  });

  it("has one plan in breakdown", () => {
    expect(result.studentLoan.annual.planBreakdown.length).toBe(1);
  });
});

// ─── Plan 2 + postgrad combined — £35,000 ─────────────────────────────
describe("Student loan plan 2 + postgrad — £35,000", () => {
  const result = calculateTakeHome(
    makeInput(35000, { studentLoanPlans: ["plan2", "postgrad"] }),
  );

  it("calculates both plans independently and sums them annually", () => {
    // plan2:    (£35,000 - £29,385) × 9% = £505.35
    // postgrad: (£35,000 - £21,000) × 6% = £840.00
    expect(result.studentLoan.annual.totalRepayment).toBe(round(505.35 + 840));
  });

  it("has two plans in breakdown", () => {
    expect(result.studentLoan.annual.planBreakdown.length).toBe(2);
  });

  it("calculates postgrad repayment correctly", () => {
    const postgrad = result.studentLoan.annual.planBreakdown.find(
      (p) => p.plan === "postgrad",
    );
    expect(postgrad?.repayment).toBe(840);
  });
});

// Student loan below threshold — £20,000
describe("Student loan plan 2 below threshold — £20,000", () => {
  const result = calculateTakeHome(
    makeInput(20000, { studentLoanPlans: ["plan2"] }),
  );

  it("no repayment below annual threshold", () => {
    expect(result.studentLoan.annual.totalRepayment).toBe(0);
  });

  it("no repayment below monthly threshold", () => {
    expect(result.studentLoan.monthly.totalRepayment).toBe(0);
  });
});

// Scottish taxpayer — £30,000
describe("Scottish taxpayer — £30,000", () => {
  const result = calculateTakeHome(makeInput(30000, { region: "scotland" }));

  it("calculates correct Scottish income tax", () => {
    // Starter:      (£3967 - £0) × 19% = £753.73
    // Basic:        (£16,956 - £3,967) × 20% = £2,597.80
    // Intermediate: (£17,430 - £16,956) × 21% = £99.54
    // Total: £3,451.07
    expect(result.incomeTax.annual.incomeTax).toBe(3451.07);
  });

  it("pays less tax than rUK at £30,000", () => {
    const rUK = calculateTakeHome(makeInput(30000));
    expect(result.incomeTax.annual.incomeTax).toBeLessThan(
      rUK.incomeTax.annual.incomeTax,
    );
  });

  it("pays more tax than rUK at £50,000", () => {
    const scottish = calculateTakeHome(
      makeInput(50000, { region: "scotland" }),
    );
    const rUK = calculateTakeHome(makeInput(50000));
    expect(scottish.incomeTax.annual.incomeTax).toBeGreaterThan(
      rUK.incomeTax.annual.incomeTax,
    );
  });

  it("has more bands in breakdown than rUK", () => {
    const rUK = calculateTakeHome(makeInput(30000));
    expect(result.incomeTax.annual.bandBreakdown.length).toBeGreaterThan(
      rUK.incomeTax.annual.bandBreakdown.length,
    );
  });
});

// Tax code BR — £30,000
describe("Tax code BR — £30,000", () => {
  const result = calculateTakeHome(makeInput(30000, { taxCode: "BR" }));

  it("taxes entire gross at basic rate", () => {
    expect(result.incomeTax.annual.incomeTax).toBe(30000 * 0.2);
  });

  it("has zero personal allowance", () => {
    expect(result.incomeTax.annual.personalAllowance).toBe(0);
  });

  it("has one flat rate band in breakdown", () => {
    expect(result.incomeTax.annual.bandBreakdown.length).toBe(1);
  });
});

// Tax code D0 — £60,000
describe("Tax code D0 — £60,000", () => {
  const result = calculateTakeHome(makeInput(60000, { taxCode: "D0" }));

  it("taxes entire gross at higher rate", () => {
    expect(result.incomeTax.annual.incomeTax).toBe(60000 * 0.4);
  });
});

// Tax code NT — £30,000
describe("Tax code NT — £30,000", () => {
  const result = calculateTakeHome(makeInput(30000, { taxCode: "NT" }));

  it("applies no income tax", () => {
    expect(result.incomeTax.annual.incomeTax).toBe(0);
  });

  it("still applies NI", () => {
    expect(result.nationalInsurance.annual.total).toBeGreaterThan(0);
  });
});

// Tax code 0T — £30,000
describe("Tax code 0T — £30,000", () => {
  const result = calculateTakeHome(makeInput(30000, { taxCode: "0T" }));

  it("applies no personal allowance", () => {
    expect(result.incomeTax.annual.personalAllowance).toBe(0);
  });

  it("taxes full gross through bands", () => {
    // Full £30,000 taxed at 20% = £6,000
    expect(result.incomeTax.annual.incomeTax).toBe(6000);
  });
});

// Tax code 1000L — £30,000
describe("Tax code 1000L — £30,000", () => {
  const result = calculateTakeHome(makeInput(30000, { taxCode: "1000L" }));

  it("applies reduced personal allowance of £10,000", () => {
    expect(result.incomeTax.annual.personalAllowance).toBe(10000);
  });

  it("calculates tax on reduced taxable income", () => {
    // Taxable: £30,000 - £10,000 = £20,000
    // Tax: £20,000 × 20% = £4,000
    expect(result.incomeTax.annual.incomeTax).toBe(4000);
  });

  it("pays more tax than standard 1257L", () => {
    const standard = calculateTakeHome(makeInput(30000));
    expect(result.incomeTax.annual.incomeTax).toBeGreaterThan(
      standard.incomeTax.annual.incomeTax,
    );
  });
});

// K code — £30,000 K100
describe("Tax code K100 — £30,000", () => {
  const result = calculateTakeHome(makeInput(30000, { taxCode: "K100" }));

  it("applies negative personal allowance of -£1,000", () => {
    expect(result.incomeTax.annual.personalAllowance).toBe(-1000);
  });

  it("taxes more than gross", () => {
    // Taxable: £30,000 + £1,000 = £31,000
    // Tax: £31,000 × 20% = £6,200
    expect(result.incomeTax.annual.incomeTax).toBe(6200);
  });
});

// NI thresholds — period specific
describe("NI period-specific thresholds", () => {
  const result = calculateTakeHome(makeInput(30000));

  it("monthly NI uses monthly threshold not annual divided by 12", () => {
    // Monthly income: £30,000 / 12 = £2,500
    // Monthly PT: £1,048, Monthly UEL: £4,189
    // NI: (£2,500 - £1,048) × 8% = £116.16
    expect(result.nationalInsurance.monthly.total).toBe(
      round((2500 - 1048) * 0.08),
    );
  });

  it("weekly NI uses weekly threshold not annual divided by 52", () => {
    // Weekly income: £30,000 / 52 = £576.92
    // Weekly PT: £242, Weekly UEL: £967
    // NI: (£576.92 - £242) × 8% = £26.79
    const weeklyIncome = round(30000 / 52);
    expect(round(result.nationalInsurance.weekly.total)).toBe(
      round((weeklyIncome - 242) * 0.08),
    );
  });
});

// Bonus — one-off monthly
describe("One-off monthly bonus £500 on £25,000 salary", () => {
  const result = calculateTakeHome(
    makeInput(25000, {
      bonusInput: { amount: 500, frequency: "one-off", period: "monthly" },
    }),
  );

  it("adds bonus to annual gross", () => {
    expect(result.gross.annual).toBe(25500);
  });

  it("adds bonus to monthly gross", () => {
    expect(result.gross.monthly).toBe(round(25000 / 12 + 500));
  });

  it("adds bonus to weekly gross", () => {
    expect(result.gross.weekly).toBe(round(25000 / 52 + 500));
  });
});

// Bonus — regular monthly
describe("Regular monthly bonus £500 on £25,000 salary", () => {
  const result = calculateTakeHome(
    makeInput(25000, {
      bonusInput: { amount: 500, frequency: "regular", period: "monthly" },
    }),
  );

  it("annualises regular bonus to annual gross", () => {
    // £25,000 + (£500 × 12) = £31,000
    expect(result.gross.annual).toBe(31000);
  });

  it("shows monthly bonus in monthly gross", () => {
    expect(result.gross.monthly).toBe(round(25000 / 12 + 500));
  });
});

// Taxable benefits
describe("Regular monthly taxable benefit £100 on £30,000 salary", () => {
  const result = calculateTakeHome(
    makeInput(30000, {
      taxableBenefitsInput: {
        amount: 100,
        frequency: "regular",
        period: "monthly",
      },
    }),
  );

  it("adds annualised benefit to annual gross", () => {
    expect(result.gross.annual).toBe(31200);
  });

  it("increases income tax vs no benefit", () => {
    const noBenefit = calculateTakeHome(makeInput(30000));
    expect(result.incomeTax.annual.incomeTax).toBeGreaterThan(
      noBenefit.incomeTax.annual.incomeTax,
    );
  });
});

// Non-taxable benefits
describe("Non-taxable benefit £100/month on £30,000 salary", () => {
  const result = calculateTakeHome(
    makeInput(30000, {
      nonTaxableBenefitsInput: {
        amount: 100,
        frequency: "regular",
        period: "monthly",
      },
    }),
  );

  it("adds non-taxable benefit to display gross", () => {
    expect(result.gross.annual).toBe(31200);
  });

  it("does not increase income tax", () => {
    const noBenefit = calculateTakeHome(makeInput(30000));
    expect(result.incomeTax.annual.incomeTax).toBe(
      noBenefit.incomeTax.annual.incomeTax,
    );
  });

  it("does not increase NI", () => {
    const noBenefit = calculateTakeHome(makeInput(30000));
    expect(result.nationalInsurance.annual.total).toBe(
      noBenefit.nationalInsurance.annual.total,
    );
  });
});

// Monthly salary input
describe("Monthly salary input — £2,500/month", () => {
  const result = calculateTakeHome({
    ...defaults,
    salaryInput: { amount: 2500, period: "monthly" },
  });

  it("annualises to £30,000", () => {
    expect(result.gross.annual).toBe(30000);
  });

  it("monthly gross is exactly input amount", () => {
    expect(result.gross.monthly).toBe(2500);
  });
});

// Weekly salary input
describe("Weekly salary input — £577/week", () => {
  const result = calculateTakeHome({
    ...defaults,
    salaryInput: { amount: 577, period: "weekly" },
  });

  it("annualises to £30,004", () => {
    expect(result.gross.annual).toBe(577 * 52);
  });

  it("weekly gross is exactly input amount", () => {
    expect(result.gross.weekly).toBe(577);
  });
});

// Zero salary
describe("Zero salary", () => {
  const result = calculateTakeHome(makeInput(0));

  it("returns zero income tax", () => {
    expect(result.incomeTax.annual.incomeTax).toBe(0);
  });

  it("returns zero NI", () => {
    expect(result.nationalInsurance.annual.total).toBe(0);
  });

  it("returns zero net", () => {
    expect(result.net.annual).toBe(0);
  });
});

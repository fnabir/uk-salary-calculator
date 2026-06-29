import { TaxYearConfig } from "../config";

export const config2026_27: TaxYearConfig = {
  personalAllowance: 12570,
  personalAllowanceTaperThreshold: 100000,
  personalAllowanceTaperEnd: 125140,

  incomeTax: {
    uk: [
      { label: "Basic Rate", rate: 0.2, from: 0, to: 37700 },
      { label: "Higher Rate", rate: 0.4, from: 37700, to: 125140 },
      { label: "Additional Rate", rate: 0.45, from: 125140, to: null },
    ],
    scotland: [
      { label: "Starter Rate", rate: 0.19, from: 0, to: 3967 },
      { label: "Basic Rate", rate: 0.2, from: 3967, to: 16956 },
      { label: "Intermediate Rate", rate: 0.21, from: 16956, to: 31092 },
      { label: "Higher Rate", rate: 0.42, from: 31092, to: 62430 },
      { label: "Advanced Rate", rate: 0.45, from: 62430, to: 112570 },
      { label: "Top Rate", rate: 0.48, from: 112570, to: null },
    ],
  },

  ni: [
    {
      rate: 0.0,
      from: { annual: 0, monthly: 0, weekly: 0 },
      to: { annual: 12570, monthly: 1048, weekly: 242 },
    }, // Below Primary Threshold
    {
      rate: 0.08,
      from: { annual: 12570, monthly: 1048, weekly: 242 },
      to: { annual: 50270, monthly: 4189, weekly: 967 },
    }, // Main rate
    {
      rate: 0.02,
      from: { annual: 50270, monthly: 4189, weekly: 967 },
      to: null,
    }, // Above Upper Earnings Limit
  ],

  studentLoan: [
    {
      plan: "plan1",
      rate: 0.09,
      threshold: { annual: 26900, monthly: 2241, weekly: 517 },
    },
    {
      plan: "plan2",
      rate: 0.09,
      threshold: { annual: 29385, monthly: 2448, weekly: 565 },
    },
    {
      plan: "plan4",
      rate: 0.09,
      threshold: { annual: 33795, monthly: 2816, weekly: 649 },
    }, // Scotland only
    {
      plan: "plan5",
      rate: 0.09,
      threshold: { annual: 25000, monthly: 2083, weekly: 480 },
    },
    {
      plan: "postgrad",
      rate: 0.06,
      threshold: { annual: 21000, monthly: 1750, weekly: 403 },
    },
  ],

  pension: {
    autoEnrolmentLower: 6240,
    autoEnrolmentUpper: 50270,
    employeeMinRate: 0.05,
    employerMinRate: 0.03,
  },
};

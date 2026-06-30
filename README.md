# 🇬🇧 UK Salary Calculator

A fast, accurate, and beautifully animated UK take-home pay calculator built with Next.js, TypeScript, and Tailwind CSS. Covers Income Tax, National Insurance, Student Loan, and Pension for tax year 2026/27.

![UK Salary Calculator](https://img.shields.io/badge/Tax%20Year-2026%2F27-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blueviolet)
[![License](https://img.shields.io/badge/License-Proprietary-crimson)](LICENSE.md)

---

## Features

- **Accurate tax calculations** — Income Tax (rUK + Scottish rates), National Insurance, Student Loan (Plans 1, 2, 4, 5, Postgraduate), and Pension (salary sacrifice + relief at source)
- **Period-aware calculations** — Annual, monthly, and weekly figures calculated independently with period-specific thresholds, not just divided from annual
- **Bonus & benefits support** — One-off or regular bonus, taxable benefits, and non-taxable benefits with flexible period selection
- **Tax code parsing** — Supports standard (`1257L`), flat rate (`BR`, `D0`, `D1`), no tax (`NT`), no allowance (`0T`), and K codes with personal allowance taper above £100,000
- **Scottish tax rates** — Full Scottish Income Tax band support (Starter, Basic, Intermediate, Higher, Advanced, Top rates)
- **Expandable breakdown** — Collapsible Income Tax band breakdown, NI band breakdown, and Student Loan plan breakdown
- **Animated UI** — Smooth number animations, height transitions, and staggered entry using Framer Motion
- **Dark / Light / System theme** — Theme toggle defaulting to system preference
- **Responsive layout** — Split panel on desktop, single column on mobile

---

## Tech Stack

| Category        | Technology                                                |
| --------------- | --------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org) (App Router)             |
| Language        | TypeScript                                                |
| Styling         | Tailwind CSS                                              |
| Components      | [shadcn/ui](https://ui.shadcn.com) (Radix primitives)     |
| Animation       | [Framer Motion](https://www.framer.com/motion)            |
| Theming         | [next-themes](https://github.com/pacocoursey/next-themes) |
| Package Manager | pnpm                                                      |
| React Compiler  | Enabled (React 19)                                        |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider
│   └── page.tsx                # Entry point
├── components/
│   ├── calculator/
│   │   ├── CalculatorLayout.tsx
│   │   ├── inputs/
│   │   │   ├── GrossSalarySection.tsx   # Salary, bonus, benefits
│   │   │   ├── TaxCodeInput.tsx
│   │   │   ├── RegionSelect.tsx
│   │   │   ├── PensionInputs.tsx
│   │   │   └── StudentLoanSelect.tsx
│   │   └── results/
│   │       ├── ResultsPanel.tsx
│   │       ├── PeriodToggle.tsx
│   │       ├── SummaryCards.tsx
│   │       └── BreakdownSection.tsx
│   ├── providers/
│   │   └── ThemeProvider.tsx
│   └── ui/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── ThemeToggle.tsx
│       └── ...shadcn components
├── hooks/
│   ├── useCalculator.ts        # Main state + calculation hook
│   └── useAnimatedNumber.ts    # Framer Motion spring animation
└── lib/
    ├── animations.ts           # Shared Framer Motion variants
    ├── utils/
    │   └── index.ts            # round(), formatCurrency()
    └── tax/
        ├── config.ts           # Types + TaxYearConfig interface
        ├── taxCode.ts          # parseTaxCode + resolvePersonalAllowance
        ├── index.ts            # TAX_CONFIGS lookup map
        ├── years/
        │   └── 2026-27.ts      # Band data, NI thresholds, student loan thresholds
        └── calculations/
            ├── salary.ts
            ├── bonusBenefits.ts
            ├── pension.ts
            ├── incomeTax.ts
            ├── nationalInsurance.ts
            ├── studentLoan.ts
            └── index.ts        # calculateTakeHome()
```

---

## Tax Calculations

All calculation logic lives in pure TypeScript functions in `src/lib/tax/` — completely decoupled from the UI.

### Income Tax (2026/27)

**rUK (England, Wales, Northern Ireland)**

| Band            | Rate | Taxable Income     |
| --------------- | ---- | ------------------ |
| Basic Rate      | 20%  | £0 – £37,700       |
| Higher Rate     | 40%  | £37,701 – £125,140 |
| Additional Rate | 45%  | Over £125,140      |

**Scotland**

| Band              | Rate | Taxable Income     |
| ----------------- | ---- | ------------------ |
| Starter Rate      | 19%  | £0 – £3,967        |
| Basic Rate        | 20%  | £3,968 – £16,956   |
| Intermediate Rate | 21%  | £16,956 – £31,092  |
| Higher Rate       | 42%  | £31,093 – £62,430  |
| Advanced Rate     | 45%  | £62,431 – £125,140 |
| Top Rate          | 48%  | Over £125,140      |

Personal Allowance is £12,570, tapering by £1 for every £2 earned over £100,000 and disappearing entirely at £125,140.

### National Insurance (2026/27)

Period-specific thresholds — calculated independently per period, not divided from annual.

| Rate | Annual            | Monthly         | Weekly      |
| ---- | ----------------- | --------------- | ----------- |
| 0%   | £0 – £12,570      | £0 – £1,048     | £0 – £242   |
| 8%   | £12,571 – £50,270 | £1,049 – £4,189 | £243 – £967 |
| 2%   | Over £50,270      | Over £4,189     | Over £967   |

### Student Loan

Period-specific repayment thresholds — repayments only trigger when the period income exceeds the period threshold.

| Plan              | Rate | Annual  | Monthly | Weekly |
| ----------------- | ---- | ------- | ------- | ------ |
| Plan 1            | 9%   | £26,900 | £2,241  | £517   |
| Plan 2            | 9%   | £29,385 | £2,448  | £565   |
| Plan 4 (Scotland) | 9%   | £33,795 | £2,816  | £649   |
| Plan 5            | 9%   | £25,000 | £2,083  | £480   |
| Postgraduate      | 6%   | £21,000 | £1,750  | £403   |

Multiple plans are supported simultaneously.

### Pension

Contributions calculated on qualifying earnings between £6,240 and £50,270.

- **Salary sacrifice** — contributions deducted before Income Tax and NI are calculated, reducing taxable income and NI liability
- **Relief at source** — contributions deducted after tax; HMRC adds basic rate relief directly to the pension pot

### Bonus & Benefits

| Type                 | Frequency | Annual Gross Impact              |
| -------------------- | --------- | -------------------------------- |
| Bonus                | One-off   | Raw amount added once            |
| Bonus                | Regular   | Annualised by period             |
| Taxable Benefits     | One-off   | Raw amount added once            |
| Taxable Benefits     | Regular   | Annualised by period             |
| Non-Taxable Benefits | Any       | Display only — excluded from tax |

---

## Supported Tax Codes

| Code        | Description                                         |
| ----------- | --------------------------------------------------- |
| `1257L`     | Standard — personal allowance of £12,570            |
| `1000L`     | Custom allowance — `number × 10`                    |
| `BR`        | Basic rate on all income                            |
| `D0`        | Higher rate on all income                           |
| `D1`        | Additional rate on all income                       |
| `NT`        | No tax                                              |
| `0T`        | No personal allowance                               |
| `K100`      | Negative allowance — `K number × 10` reduction      |
| `W1` / `M1` | Emergency suffix — stripped and treated as standard |

---

## Running Tests

Tests are written in Jest and cover the full calculation layer — no UI tests.

Key test scenarios:

- Basic rate taxpayer (£30,000)
- Higher rate taxpayer (£60,000)
- Personal allowance taper (£110,000 and £125,140)
- Salary sacrifice pension
- Student loan Plan 2 and Plan 2 + Postgraduate combined
- Scottish vs rUK tax comparison
- Tax codes BR and NT
- Period-specific NI and Student Loan thresholds

Verified results against [HMRC's calculator](https://www.tax.service.gov.uk/estimate-paye-take-home-pay) or [listentotaxman.com](https://listentotaxman.com) before releasing updates.

## Disclaimer

This calculator is provided for informational purposes only. Results are estimates based on the inputs provided and standard tax rules. Individual circumstances may vary. Always consult HMRC or a qualified tax adviser for definitive tax calculations.

---

## License

This project is licensed under a proprietary license. Please refer to the [LICENSE](./LICENSE) file for full terms.

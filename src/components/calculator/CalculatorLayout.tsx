"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, transitions } from "@/lib/animations";
import { TaxCodeInput } from "@/components/calculator/inputs/TaxCodeInput";
import { RegionSelect } from "@/components/calculator/inputs/RegionSelect";
import { PensionInputs } from "@/components/calculator/inputs/PensionInputs";
import { StudentLoanSelect } from "@/components/calculator/inputs/StudentLoanSelect";
import { Separator } from "@/components/ui/separator";
import { useCalculator } from "@/hooks/useCalculator";
import { ResultsPanel } from "./results/ResultsPanel";
import { GrossSalarySection } from "./inputs/GrossSalarySection";
import { Header } from "../ui/Header";
import { Footer } from "../ui/Footer";

export function CalculatorLayout() {
  const {
    state,
    result,
    setSalary,
    setBonus,
    setTaxableBenefits,
    setNonTaxableBenefits,
    setTaxCode,
    setRegion,
    setPensionEmployeeRate,
    setPensionEmployerRate,
    setPensionType,
    setStudentLoanPlans,
  } = useCalculator();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="container flex-1 mx-auto max-w-6xl px-4 py-6 flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start">
        {/* Inputs panel */}
        <motion.section
          className="w-full lg:w-lg lg:shrink-0 lg:sticky lg:top-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeInUp}
            transition={transitions.smooth}
            className="rounded-xl border border-border bg-card px-4 lg:px-6 py-6 shadow-lg flex flex-col gap-4"
          >
            <GrossSalarySection
              salary={state.salary}
              bonus={state.bonus}
              taxableBenefits={state.taxableBenefits}
              nonTaxableBenefits={state.nonTaxableBenefits}
              onSalaryChange={setSalary}
              onBonusChange={setBonus}
              onTaxableBenefitsChange={setTaxableBenefits}
              onNonTaxableBenefitsChange={setNonTaxableBenefits}
            />

            <Separator />

            <TaxCodeInput value={state.taxCode} onChange={setTaxCode} />

            <Separator />

            <RegionSelect value={state.region} onChange={setRegion} />

            <Separator />

            <PensionInputs
              employeeRate={state.pension.employeeRate}
              employerRate={state.pension.employerRate}
              type={state.pension.type}
              onEmployeeRateChange={setPensionEmployeeRate}
              onEmployerRateChange={setPensionEmployerRate}
              onTypeChange={setPensionType}
            />

            <Separator />

            <StudentLoanSelect
              selected={state.studentLoanPlans}
              onChange={setStudentLoanPlans}
            />
          </motion.div>
        </motion.section>

        {/* Results panel */}
        <motion.section
          className="w-full lg:flex-1"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeInUp}
            transition={transitions.smooth}
            className="rounded-xl border border-border bg-card p-6 shadow-lg"
          >
            {result ? (
              <ResultsPanel result={result} />
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center py-16 gap-3"
                variants={fadeInUp}
                transition={transitions.smooth}
              >
                <p className="text-muted-foreground text-sm">
                  Enter your salary to see your take-home pay
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

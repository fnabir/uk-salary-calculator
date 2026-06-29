import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "UK Salary Calculator",

  description:
    "Calculate your UK take-home pay for 2026/27. Covers Income Tax, National Insurance, Student Loan (Plans 1-5), pension, and Scottish tax rates. Instant results with full breakdown.",

  keywords: [
    "UK salary calculator",
    "take home pay calculator",
    "UK income tax calculator",
    "national insurance calculator",
    "salary after tax UK",
    "student loan repayment calculator",
    "Scottish income tax calculator",
    "pension salary sacrifice calculator",
    "UK payslip calculator",
    "2026 27 tax calculator",
  ],

  authors: [{ name: "Farhan Noor Abir" }],
  creator: "Farhan Noor Abir",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "UK Salary Calculator",
    title: "UK Salary Calculator — Take-Home Pay After Tax",
    description:
      "Calculate your UK take-home pay. Covers Income Tax, National Insurance, Student Loan, pension, and Scottish tax rates. Instant results with full breakdown.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UK Salary Calculator — Take-Home Pay After Tax",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "UK Salary Calculator — Take-Home Pay After Tax",
    description:
      "Calculate your UK take-home pay. Income Tax, NI, Student Loan, pension, and Scottish rates. Instant full breakdown.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.className)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

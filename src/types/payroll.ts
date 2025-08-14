export interface Employee {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  basePay: number;
  bonus: number;
  commission: number;
  overtime: number;
  gifFlex: number;
  onCall: number;
  salaryBasis: 'Monthly' | 'Hourly' | 'Annual';
  units: number;
  rate: number;
  totalIncome: number;
  deductions: number;
  takeHomePay: number;
  employerCost: number;
  status: 'Current' | 'Terminated' | 'On Leave';
  department: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contractor';
  // Deduction breakdown
  paye: number;
  ni: number;
  pension: number;
  studentLoan: number;
  postgradLoan: number;
  deductionVariance?: number;
  netPaymentVariance?: number;
  // Employer cost breakdown
  employerNI: number;
  employerPension: number;
  // Previous month data for comparison
  previousMonth?: {
    basePay: number;
    bonus: number;
    commission: number;
    overtime: number;
    gifFlex: number;
    onCall: number;
    totalIncome: number;
    deductions: number;
    takeHomePay: number;
    employerCost: number;
    paye: number;
    ni: number;
    pension: number;
    studentLoan: number;
    postgradLoan: number;
    employerNI: number;
    employerPension: number;
  };
}

export interface AdvancedFilter {
  id: string;
  payElement: string;
  condition: 'greater' | 'less' | 'equal';
  value: number;
  isPercentage: boolean;
  compareToLastMonth: boolean;
}

export interface PayrollPeriod {
  month: string;
  year: number;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Confirmed';
  employeeCount: number;
  companyName: string;
}

export interface PayrollSummary {
  totalIncome: number;
  totalDeductions: number;
  totalTakeHomePay: number;
  totalEmployerCost: number;
  employeeCount: number;
}

export type TabType = 'summary' | 'income' | 'deductions' | 'employer-cost';
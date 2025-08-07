import { Employee, PayrollPeriod, PayrollSummary } from '@/types/payroll';

export const employees: Employee[] = [
  {
    id: '1',
    name: 'Ahmad Kobeiter Abiad',
    initials: 'AK',
    basePay: 3750.00,
    salaryBasis: 'Monthly',
    units: 1,
    rate: 3750.00,
    totalIncome: 3750.00,
    deductions: 885.56,
    takeHomePay: 2864.44,
    employerCost: 4346.85,
    status: 'Current'
  },
  {
    id: '2', 
    name: 'Mariana Gentilhomem',
    initials: 'MG',
    basePay: 3750.00,
    salaryBasis: 'Monthly',
    units: 1,
    rate: 3750.00,
    totalIncome: 3750.00,
    deductions: 904.96,
    takeHomePay: 2845.04,
    employerCost: 4346.85,
    status: 'Current'
  },
  {
    id: '3',
    name: 'Michael Rose',
    initials: 'MR',
    basePay: 4416.67,
    salaryBasis: 'Monthly',
    units: 1,
    rate: 4416.67,
    totalIncome: 4416.67,
    deductions: 1268.25,
    takeHomePay: 3148.42,
    employerCost: 5126.69,
    status: 'Current'
  },
  {
    id: '4',
    name: 'Nix Hall',
    initials: 'NH',
    basePay: 5833.33,
    salaryBasis: 'Monthly',
    units: 1,
    rate: 5833.33,
    totalIncome: 5833.33,
    deductions: 1899.08,
    takeHomePay: 3934.25,
    employerCost: 6818.40,
    status: 'Current'
  },
  {
    id: '5',
    name: 'Rafael Boni',
    initials: 'RB',
    basePay: 4000.00,
    salaryBasis: 'Monthly',
    units: 1,
    rate: 4000.00,
    totalIncome: 4000.00,
    deductions: 965.56,
    takeHomePay: 3034.44,
    employerCost: 4641.85,
    status: 'Current'
  },
  {
    id: '6',
    name: 'Theo Gardner',
    initials: 'TG',
    basePay: 4275.00,
    salaryBasis: 'Monthly',
    units: 1,
    rate: 4275.00,
    totalIncome: 4275.00,
    deductions: 1383.82,
    takeHomePay: 2891.18,
    employerCost: 4963.77,
    status: 'Current'
  },
  {
    id: '7',
    name: 'Zoe Yu Tung Law',
    initials: 'ZL',
    basePay: 5833.33,
    salaryBasis: 'Monthly',
    units: 1,
    rate: 5833.33,
    totalIncome: 5833.33,
    deductions: 1860.68,
    takeHomePay: 3972.65,
    employerCost: 6818.40,
    status: 'Current'
  }
];

export const payrollPeriod: PayrollPeriod = {
  month: 'July',
  year: 2025,
  startDate: '1 Jul',
  endDate: '31 Jul 2025',
  status: 'Draft',
  employeeCount: 7,
  companyName: 'NEW WAVE BIOTECH LTD'
};

export const payrollSummary: PayrollSummary = {
  totalIncome: employees.reduce((sum, emp) => sum + emp.totalIncome, 0),
  totalDeductions: employees.reduce((sum, emp) => sum + emp.deductions, 0),
  totalTakeHomePay: employees.reduce((sum, emp) => sum + emp.takeHomePay, 0),
  totalEmployerCost: employees.reduce((sum, emp) => sum + emp.employerCost, 0),
  employeeCount: employees.length
};
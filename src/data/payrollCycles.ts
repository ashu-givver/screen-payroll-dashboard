export interface PayrollCycle {
  id: string;
  period: string;
  month: string;
  year: number;
  startDate: string;
  endDate: string;
  status: 'Current' | 'Submitted' | 'Completed';
  employeeCount: number;
  totalPay: number;
  submittedDate?: string;
  completedDate?: string;
}

export const payrollCycles: PayrollCycle[] = [
  // Current
  {
    id: 'current-2025-07',
    period: 'July 2025 Payroll',
    month: 'July',
    year: 2025,
    startDate: '1 Jul',
    endDate: '31 Jul 2025',
    status: 'Current',
    employeeCount: 7,
    totalPay: 33608.55
  },
  
  // Submitted
  {
    id: 'submitted-2025-06',
    period: 'June 2025 Payroll',
    month: 'June',
    year: 2025,
    startDate: '1 Jun',
    endDate: '30 Jun 2025',
    status: 'Submitted',
    employeeCount: 7,
    totalPay: 31245.20,
    submittedDate: '2 Jul 2025'
  },
  {
    id: 'submitted-2025-05',
    period: 'May 2025 Payroll',
    month: 'May',
    year: 2025,
    startDate: '1 May',
    endDate: '31 May 2025',
    status: 'Submitted',
    employeeCount: 7,
    totalPay: 32180.40,
    submittedDate: '3 Jun 2025'
  },
  
  // Completed
  {
    id: 'completed-2025-04',
    period: 'April 2025 Payroll',
    month: 'April',
    year: 2025,
    startDate: '1 Apr',
    endDate: '30 Apr 2025',
    status: 'Completed',
    employeeCount: 7,
    totalPay: 30950.75,
    submittedDate: '2 May 2025',
    completedDate: '7 May 2025'
  },
  {
    id: 'completed-2025-03',
    period: 'March 2025 Payroll',
    month: 'March',
    year: 2025,
    startDate: '1 Mar',
    endDate: '31 Mar 2025',
    status: 'Completed',
    employeeCount: 7,
    totalPay: 31865.90,
    submittedDate: '1 Apr 2025',
    completedDate: '5 Apr 2025'
  },
  {
    id: 'completed-2025-02',
    period: 'February 2025 Payroll',
    month: 'February',
    year: 2025,
    startDate: '1 Feb',
    endDate: '28 Feb 2025',
    status: 'Completed',
    employeeCount: 6,
    totalPay: 28920.45,
    submittedDate: '1 Mar 2025',
    completedDate: '4 Mar 2025'
  }
];
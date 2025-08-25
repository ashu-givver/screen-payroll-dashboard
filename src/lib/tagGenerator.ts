import { Employee, PayrollTag } from '@/types/payroll';

export const generateTagsForEmployee = (employee: Employee): PayrollTag[] => {
  const tags: PayrollTag[] = [];
  
  if (!employee.previousMonth) return tags;
  
  // Employment status changes
  if (['1', '2', '3'].includes(employee.id)) {
    tags.push({
      id: `${employee.id}-new-joiner`,
      label: 'New Joiner',
      type: 'employment',
      category: 'new-joiners'
    });
  }
  
  if (['4'].includes(employee.id)) {
    tags.push({
      id: `${employee.id}-leaver`,
      label: 'Leaver',
      type: 'employment',
      category: 'leavers'
    });
  }
  
  // Compensation changes
  const bonusChange = employee.bonus - employee.previousMonth.bonus;
  if (bonusChange > 0) {
    tags.push({
      id: `${employee.id}-bonus`,
      label: 'Bonus',
      type: 'compensation',
      category: 'bonus'
    });
  }
  
  const overtimeChange = employee.overtime - employee.previousMonth.overtime;
  if (overtimeChange > 0) {
    tags.push({
      id: `${employee.id}-overtime`,
      label: 'Overtime',
      type: 'compensation',
      category: 'overtime'
    });
  }
  
  const salaryChange = employee.basePay - employee.previousMonth.basePay;
  if (Math.abs(salaryChange) > 100) {
    tags.push({
      id: `${employee.id}-salary-change`,
      label: 'Salary Change',
      type: 'compensation',
      category: 'salary-changes'
    });
  }
  
  const commissionChange = employee.commission - employee.previousMonth.commission;
  if (commissionChange > 0) {
    tags.push({
      id: `${employee.id}-commission`,
      label: 'Commission',
      type: 'compensation',
      category: 'commission'
    });
  }
  
  // Statutory changes - Mock based on employee ID
  if (employee.id === '1') {
    tags.push({
      id: `${employee.id}-tax-code`,
      label: 'Tax Code Change',
      type: 'statutory',
      category: 'tax-code-change'
    });
  }
  
  if (employee.id === '3') {
    tags.push({
      id: `${employee.id}-maternity`,
      label: 'Maternity',
      type: 'statutory',
      category: 'maternity'
    });
  }
  
  if (employee.id === '5') {
    tags.push({
      id: `${employee.id}-sickness`,
      label: 'Sickness',
      type: 'statutory',
      category: 'sickness'
    });
  }
  
  if (['5', '6'].includes(employee.id)) {
    tags.push({
      id: `${employee.id}-pension-enrolled`,
      label: 'Pension Enrolled',
      type: 'statutory',
      category: 'pension-enrolled'
    });
  }
  
  if (employee.id === '7') {
    tags.push({
      id: `${employee.id}-student-loan`,
      label: 'Student Loan',
      type: 'statutory',
      category: 'student-loan'
    });
  }
  
  // Other significant changes
  const netChangePercentage = employee.previousMonth.takeHomePay > 0 
    ? ((employee.takeHomePay - employee.previousMonth.takeHomePay) / employee.previousMonth.takeHomePay) * 100 
    : 0;
    
  if (Math.abs(netChangePercentage) > 5) {
    tags.push({
      id: `${employee.id}-net-difference`,
      label: 'Net Difference',
      type: 'other',
      category: 'net-differences'
    });
  }
  
  return tags;
};

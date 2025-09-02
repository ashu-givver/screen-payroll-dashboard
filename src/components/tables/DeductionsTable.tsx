import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check } from 'lucide-react';
import { NotionTable, NotionTableHeader, NotionTableBody, NotionTableRow, NotionTableHead, NotionTableCell } from '@/components/NotionTable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/formatters';

interface DeductionsTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  viewMode: 'compact' | 'detailed' | 'simple';
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
}

export const DeductionsTable = ({ employees, summary, viewMode, approvedEmployees, onApproveEmployee }: DeductionsTableProps) => {
  const filteredEmployees = employees;
  
  // Get color class based on percentage difference
  const getPercentageColorClass = (percentage: number) => {
    const absPercentage = Math.abs(percentage);
    
    if (absPercentage < 3) {
      return 'text-green-700 bg-green-50 border border-green-200';
    } else if (absPercentage < 5) {
      return 'text-yellow-700 bg-yellow-50 border border-yellow-200';
    } else if (absPercentage < 7) {
      return 'text-orange-700 bg-orange-50 border border-orange-200';
    } else if (absPercentage <= 10) {
      return 'text-red-700 bg-red-50 border border-red-200';
    } else {
      // For values > 10%, use red with stronger styling
      return 'text-red-800 bg-red-100 border border-red-300';
    }
  };

  // Get tooltip information about deductions differences
  const getDeductionsDifferenceTooltip = (employee: Employee) => {
    if (!employee.previousMonth) return 'No previous data available';
    
    const changes = [];
    
    // Check for changes in different deduction components
    const payeDiff = employee.paye - employee.previousMonth.paye;
    if (Math.abs(payeDiff) > 0) {
      changes.push(`PAYE: ${payeDiff > 0 ? '+' : ''}${formatCurrency(payeDiff)}`);
    }
    
    const niDiff = employee.ni - employee.previousMonth.ni;
    if (Math.abs(niDiff) > 0) {
      changes.push(`NI: ${niDiff > 0 ? '+' : ''}${formatCurrency(niDiff)}`);
    }
    
    const pensionDiff = employee.pension - employee.previousMonth.pension;
    if (Math.abs(pensionDiff) > 0) {
      changes.push(`Pension: ${pensionDiff > 0 ? '+' : ''}${formatCurrency(pensionDiff)}`);
    }
    
    const studentLoanDiff = employee.studentLoan - employee.previousMonth.studentLoan;
    if (Math.abs(studentLoanDiff) > 0) {
      changes.push(`Student Loan: ${studentLoanDiff > 0 ? '+' : ''}${formatCurrency(studentLoanDiff)}`);
    }
    
    const postgradLoanDiff = employee.postgradLoan - employee.previousMonth.postgradLoan;
    if (Math.abs(postgradLoanDiff) > 0) {
      changes.push(`Postgrad Loan: ${postgradLoanDiff > 0 ? '+' : ''}${formatCurrency(postgradLoanDiff)}`);
    }
    
    return changes.length > 0 ? changes.join(', ') : 'No changes in deduction components';
  };
  
  // Calculate summary totals for deduction breakdown
  const totalPaye = employees.reduce((sum, emp) => sum + emp.paye, 0);
  const totalNI = employees.reduce((sum, emp) => sum + emp.ni, 0);
  const totalPension = employees.reduce((sum, emp) => sum + emp.pension, 0);
  const totalStudentLoan = employees.reduce((sum, emp) => sum + emp.studentLoan, 0);
  const totalPostgradLoan = employees.reduce((sum, emp) => sum + emp.postgradLoan, 0);

  return (
    <NotionTable>
      <NotionTableHeader>
        <NotionTableRow>
          <NotionTableHead width="40px" align="center" sticky>
            <span className="text-xs font-bold uppercase tracking-wide">APPROVE</span>
          </NotionTableHead>
          <NotionTableHead width="160px" sticky>
            <span className="text-xs font-bold uppercase tracking-wide">EMPLOYEE</span>
          </NotionTableHead>
          <NotionTableHead width="120px" sticky>
            <span className="text-xs font-bold uppercase tracking-wide">DEPARTMENT</span>
          </NotionTableHead>
          <NotionTableHead width="120px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">DEDUCTIONS DIFF %</span>
          </NotionTableHead>
          <NotionTableHead width="128px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">GROSS PAY</span>
          </NotionTableHead>
          <NotionTableHead width="96px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">PAYE</span>
          </NotionTableHead>
          <NotionTableHead width="80px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">NI</span>
          </NotionTableHead>
          <NotionTableHead width="112px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">PENSION</span>
          </NotionTableHead>
          <NotionTableHead width="128px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">STUDENT LOAN</span>
          </NotionTableHead>
          <NotionTableHead width="144px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">POSTGRAD LOAN</span>
          </NotionTableHead>
          <NotionTableHead width="144px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">TOTAL DEDUCTIONS</span>
          </NotionTableHead>
        </NotionTableRow>
      </NotionTableHeader>
      <NotionTableBody>
        {/* Total row */}
        <NotionTableRow className="bg-muted/30 font-medium text-muted-foreground">
          <NotionTableCell align="center" sticky>
            <div className="w-4 h-4" />
          </NotionTableCell>
          <NotionTableCell className="text-muted-foreground" sticky>Total</NotionTableCell>
          <NotionTableCell className="text-muted-foreground" sticky>All Departments</NotionTableCell>
          <NotionTableCell align="right">
            <span className="text-xs font-medium text-muted-foreground">+6.2%</span>
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(summary.totalIncome)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(totalPaye)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(totalNI)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(totalPension)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(totalStudentLoan)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(totalPostgradLoan)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(summary.totalDeductions)}
          </NotionTableCell>
        </NotionTableRow>
          
        {/* Employee rows */}
        {filteredEmployees.map((employee, index) => {
          // Calculate total deductions change percentage
          const currentDeductions = employee.deductions;
          const previousDeductions = employee.previousMonth?.deductions || currentDeductions;
          const deductionsChangePercentage = previousDeductions > 0 
            ? ((currentDeductions - previousDeductions) / previousDeductions) * 100 
            : 0;
          
          const deductionsDifferenceTooltip = getDeductionsDifferenceTooltip(employee);
          
          return (
          <NotionTableRow 
            key={employee.id} 
            className={`hover:bg-gray-50/80 transition-colors ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}
          >
            <NotionTableCell align="center" sticky className="py-2">
              <Checkbox
                checked={approvedEmployees.has(employee.id)}
                onCheckedChange={() => onApproveEmployee(employee.id)}
                aria-label={`Approve payroll for ${employee.name}`}
                className="h-4 w-4"
              />
            </NotionTableCell>
            <NotionTableCell sticky className="py-2">
              <div className="flex items-center gap-2">
                <EmployeeAvatar 
                  name={employee.name}
                  initials={employee.initials}
                  size="sm"
                />
                <span className="font-medium text-sm truncate">{employee.name}</span>
                {approvedEmployees.has(employee.id) && (
                  <Check className="h-4 w-4 text-green-600 ml-1" />
                )}
              </div>
            </NotionTableCell>
            <NotionTableCell sticky className="py-2">
              <span className="text-sm text-muted-foreground">{employee.department}</span>
            </NotionTableCell>
            <NotionTableCell align="right" className="py-2">
              {deductionsChangePercentage !== 0 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm font-medium cursor-help text-foreground">
                        {deductionsChangePercentage > 0 ? '+' : ''}{deductionsChangePercentage.toFixed(1)}%
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-800 shadow-lg px-3 py-2 text-xs rounded-lg">
                      <p>{deductionsDifferenceTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.totalIncome)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.paye)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.ni)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.pension)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.studentLoan)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.postgradLoan)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.deductions)}
            </NotionTableCell>
          </NotionTableRow>
        );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
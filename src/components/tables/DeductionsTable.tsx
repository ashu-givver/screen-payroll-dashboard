import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
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
          <NotionTableHead width="192px" sticky>Employee</NotionTableHead>
          <NotionTableHead width="80px" align="center">Action</NotionTableHead>
          <NotionTableHead width="120px" align="right">Employee Deductions Difference %</NotionTableHead>
          <NotionTableHead width="128px" align="right">Gross Pay</NotionTableHead>
          <NotionTableHead width="96px" align="right">PAYE</NotionTableHead>
          <NotionTableHead width="80px" align="right">NI</NotionTableHead>
          <NotionTableHead width="112px" align="right">Pension</NotionTableHead>
          <NotionTableHead width="128px" align="right">Student Loan</NotionTableHead>
          <NotionTableHead width="144px" align="right">Postgraduate Loan</NotionTableHead>
          <NotionTableHead width="144px" align="right">Total Deductions</NotionTableHead>
        </NotionTableRow>
      </NotionTableHeader>
      <NotionTableBody>
        {/* Total row */}
        <NotionTableRow className="bg-muted/40 font-medium">
          <NotionTableCell className="font-semibold" sticky>Total</NotionTableCell>
          <NotionTableCell align="center">
            <Button
              size="sm"
              variant="outline"
              disabled
              className="h-6 px-2 text-xs opacity-50"
            >
              -
            </Button>
          </NotionTableCell>
          <NotionTableCell align="right">
            <span className="text-green-700 bg-green-50 border border-green-200 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium">+6.2%</span>
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(summary.totalIncome)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalPaye)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalNI)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalPension)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalStudentLoan)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalPostgradLoan)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(summary.totalDeductions)}
          </NotionTableCell>
        </NotionTableRow>
          
        {/* Employee rows */}
        {filteredEmployees.map((employee) => {
          // Calculate total deductions change percentage
          const currentDeductions = employee.deductions;
          const previousDeductions = employee.previousMonth?.deductions || currentDeductions;
          const deductionsChangePercentage = previousDeductions > 0 
            ? ((currentDeductions - previousDeductions) / previousDeductions) * 100 
            : 0;
          
          const deductionsDifferenceTooltip = getDeductionsDifferenceTooltip(employee);
          
          return (
          <NotionTableRow key={employee.id}>
            <NotionTableCell sticky>
              <div className="flex items-center gap-2">
                <EmployeeAvatar 
                  name={employee.name}
                  initials={employee.initials}
                  size="sm"
                />
                <span className="font-medium text-sm">{employee.name}</span>
              </div>
            </NotionTableCell>
            <NotionTableCell align="center">
              <Button
                size="sm"
                variant={approvedEmployees.has(employee.id) ? "secondary" : "outline"}
                onClick={() => onApproveEmployee(employee.id)}
                disabled={approvedEmployees.has(employee.id)}
                className="h-6 px-2 text-xs"
              >
                {approvedEmployees.has(employee.id) ? "✓" : "Approve"}
              </Button>
            </NotionTableCell>
            <NotionTableCell align="right">
              {deductionsChangePercentage !== 0 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium cursor-help ${getPercentageColorClass(deductionsChangePercentage)}`}>
                        {deductionsChangePercentage > 0 ? '+' : ''}{deductionsChangePercentage.toFixed(1)}%
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{deductionsDifferenceTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.totalIncome)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.paye)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.ni)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.pension)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.studentLoan)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.postgradLoan)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.deductions)}
            </NotionTableCell>
          </NotionTableRow>
        );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
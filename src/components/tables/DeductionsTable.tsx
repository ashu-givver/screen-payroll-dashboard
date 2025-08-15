import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { NotionTable, NotionTableHeader, NotionTableBody, NotionTableRow, NotionTableHead, NotionTableCell } from '@/components/NotionTable';
import { formatCurrency } from '@/lib/formatters';

interface DeductionsTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  viewMode: 'compact' | 'detailed';
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
}

export const DeductionsTable = ({ employees, summary, viewMode, approvedEmployees, onApproveEmployee }: DeductionsTableProps) => {
  const filteredEmployees = employees;
  
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
          <NotionTableHead width="192px">Employee</NotionTableHead>
          <NotionTableHead width="128px" align="right">Gross Pay</NotionTableHead>
          <NotionTableHead width="96px" align="right">PAYE</NotionTableHead>
          <NotionTableHead width="80px" align="right">NI</NotionTableHead>
          <NotionTableHead width="112px" align="right">Pension</NotionTableHead>
          <NotionTableHead width="128px" align="right">Student Loan</NotionTableHead>
          <NotionTableHead width="144px" align="right">Postgraduate Loan</NotionTableHead>
          <NotionTableHead width="144px" align="right">Total Deductions</NotionTableHead>
          <NotionTableHead width="160px" align="right">Total Deductions Change</NotionTableHead>
        </NotionTableRow>
      </NotionTableHeader>
      <NotionTableBody>
        {/* Total row */}
        <NotionTableRow className="bg-muted/40 font-medium">
          <NotionTableCell className="font-semibold">Total</NotionTableCell>
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
          <NotionTableCell align="right" className="font-semibold text-green-600">
            +6.2%
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
          
          return (
          <NotionTableRow key={employee.id}>
            <NotionTableCell>
              <div className="flex items-center gap-2">
                <EmployeeAvatar 
                  name={employee.name}
                  initials={employee.initials}
                  size="sm"
                />
                <span className="font-medium text-sm">{employee.name}</span>
              </div>
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
            <NotionTableCell align="right">
              {deductionsChangePercentage !== 0 && (
                <span className={`font-medium ${deductionsChangePercentage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {deductionsChangePercentage > 0 ? '+' : ''}{deductionsChangePercentage.toFixed(1)}%
                </span>
              )}
            </NotionTableCell>
          </NotionTableRow>
        );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
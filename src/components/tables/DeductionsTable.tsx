import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface DeductionsTableProps {
  employees: Employee[];
  summary: PayrollSummary;
}

export const DeductionsTable = ({ employees, summary }: DeductionsTableProps) => {
  // Calculate summary totals for deduction breakdown
  const totalPaye = employees.reduce((sum, emp) => sum + emp.paye, 0);
  const totalNI = employees.reduce((sum, emp) => sum + emp.ni, 0);
  const totalPension = employees.reduce((sum, emp) => sum + emp.pension, 0);
  const totalStudentLoan = employees.reduce((sum, emp) => sum + emp.studentLoan, 0);
  const totalPostgradLoan = employees.reduce((sum, emp) => sum + emp.postgradLoan, 0);

  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-left font-medium text-muted-foreground">Gross Pay</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">PAYE</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">NI</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Pension</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Student loan</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Postgrad loan</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Total deductions</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Net Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="border-b border-border bg-muted/30">
            <TableCell className="font-semibold text-payroll-total">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(totalPaye)}
            </TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(totalNI)}
            </TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(totalPension)}
            </TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(totalStudentLoan)}
            </TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(totalPostgradLoan)}
            </TableCell>
            <TableCell className="text-right font-semibold">
              <div className="flex flex-col items-end">
                <span className="text-payroll-total">{formatCurrency(summary.totalDeductions)}</span>
                <span className="text-xs text-payroll-positive">+144.08</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-semibold">
              <div className="flex flex-col items-end">
                <span className="text-payroll-total">{formatCurrency(summary.totalTakeHomePay)}</span>
                <span className="text-xs text-payroll-negative">-144.08</span>
              </div>
            </TableCell>
          </TableRow>
          
          {/* Employee rows */}
          {employees.map((employee) => (
            <TableRow key={employee.id} className="border-b border-border hover:bg-muted/20">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar 
                    name={employee.name}
                    initials={employee.initials}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium">{formatCurrency(employee.totalIncome)}</div>
                    <div className="text-sm text-muted-foreground">{employee.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.paye)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.ni)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.pension)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.studentLoan)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.postgradLoan)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{formatCurrency(employee.deductions)}</span>
                  {employee.deductionVariance && (
                    <span className={`text-xs ${employee.deductionVariance > 0 ? 'text-payroll-positive' : 'text-payroll-negative'}`}>
                      {employee.deductionVariance > 0 ? '+' : ''}{employee.deductionVariance.toFixed(2)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{formatCurrency(employee.takeHomePay)}</span>
                  {employee.netPaymentVariance && (
                    <span className={`text-xs ${employee.netPaymentVariance > 0 ? 'text-payroll-positive' : 'text-payroll-negative'}`}>
                      {employee.netPaymentVariance > 0 ? '+' : ''}{employee.netPaymentVariance.toFixed(2)}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="px-6 py-4 text-sm text-muted-foreground">
        1 - {employees.length} of {employees.length} records
      </div>
    </div>
  );
};
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gross Pay</TableHead>
            <TableHead className="text-right">PAYE</TableHead>
            <TableHead className="text-right">NI</TableHead>
            <TableHead className="text-right">Pension</TableHead>
            <TableHead className="text-right">Student loan</TableHead>
            <TableHead className="text-right">Postgrad loan</TableHead>
            <TableHead className="text-right">Total deductions</TableHead>
            <TableHead className="text-right">Net Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="bg-blue-50/30 font-medium">
            <TableCell className="font-semibold text-gray-900">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(totalPaye)}
            </TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(totalNI)}
            </TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(totalPension)}
            </TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(totalStudentLoan)}
            </TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(totalPostgradLoan)}
            </TableCell>
            <TableCell className="text-right font-semibold">
              <div className="flex flex-col items-end">
                <span className="text-gray-900">{formatCurrency(summary.totalDeductions)}</span>
                <span className="text-xs text-green-600">+144.08</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-semibold">
              <div className="flex flex-col items-end">
                <span className="text-gray-900">{formatCurrency(summary.totalTakeHomePay)}</span>
                <span className="text-xs text-red-600">-144.08</span>
              </div>
            </TableCell>
          </TableRow>
          
          {/* Employee rows */}
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <EmployeeAvatar 
                    name={employee.name}
                    initials={employee.initials}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{formatCurrency(employee.totalIncome)}</div>
                    <div className="text-xs text-gray-500">{employee.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.paye)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.ni)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.pension)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.studentLoan)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.postgradLoan)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium text-gray-900">{formatCurrency(employee.deductions)}</span>
                  {employee.deductionVariance && (
                    <span className={`text-xs ${employee.deductionVariance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {employee.deductionVariance > 0 ? '+' : ''}{employee.deductionVariance.toFixed(2)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium text-gray-900">{formatCurrency(employee.takeHomePay)}</span>
                  {employee.netPaymentVariance && (
                    <span className={`text-xs ${employee.netPaymentVariance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {employee.netPaymentVariance > 0 ? '+' : ''}{employee.netPaymentVariance.toFixed(2)}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
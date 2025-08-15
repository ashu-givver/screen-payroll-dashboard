import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    <div className="space-y-0">
      <Table>
        <TableHeader>
          <TableRow className="h-9">
            <TableHead className="w-48">Employee</TableHead>
            <TableHead className="text-right w-32">Gross Pay</TableHead>
            <TableHead className="text-right w-24">PAYE</TableHead>
            <TableHead className="text-right w-20">NI</TableHead>
            <TableHead className="text-right w-28">Pension</TableHead>
            <TableHead className="text-right w-32">Student Loan</TableHead>
            <TableHead className="text-right w-36">Postgraduate Loan</TableHead>
            <TableHead className="text-right w-36">Total Deductions</TableHead>
            <TableHead className="text-right w-40">Total Deductions Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="bg-gray-50/60 font-medium h-9">
            <TableCell className="font-semibold text-gray-900">Total</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
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
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalDeductions)}
            </TableCell>
            <TableCell className="text-right font-semibold text-green-600">
              +6.2%
            </TableCell>
          </TableRow>
          
          {/* Employee rows */}
          {filteredEmployees.map((employee) => {
            // Calculate total deductions change percentage
            const currentDeductions = employee.deductions;
            const previousDeductions = employee.previousMonth?.deductions || currentDeductions;
            const deductionsChangePercentage = previousDeductions > 0 
              ? ((currentDeductions - previousDeductions) / previousDeductions) * 100 
              : 0;
            
            return (
            <TableRow key={employee.id} className="h-9">
              <TableCell>
                <div className="flex items-center gap-2">
                  <EmployeeAvatar 
                    name={employee.name}
                    initials={employee.initials}
                    size="sm"
                  />
                  <span className="font-medium text-gray-900 text-sm">{employee.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.totalIncome)}
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
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.deductions)}
              </TableCell>
              <TableCell className="text-right">
                {deductionsChangePercentage !== 0 && (
                  <span className={`font-medium ${deductionsChangePercentage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {deductionsChangePercentage > 0 ? '+' : ''}{deductionsChangePercentage.toFixed(1)}%
                  </span>
                )}
              </TableCell>
            </TableRow>
          );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
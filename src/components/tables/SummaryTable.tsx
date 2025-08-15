import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface SummaryTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  viewMode: 'compact' | 'detailed';
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
}

export const SummaryTable = ({ employees, summary, viewMode, approvedEmployees, onApproveEmployee }: SummaryTableProps) => {
  const filteredEmployees = employees;

  return (
    <div className="space-y-0">
      <Table>
        <TableHeader>
          <TableRow className="h-9">
            <TableHead className="w-48" sticky>Employee</TableHead>
            <TableHead className="text-right w-32">Gross Up</TableHead>
            <TableHead className="text-right w-32">Deductions</TableHead>
            <TableHead className="text-right w-36">Take Home Pay</TableHead>
            <TableHead className="text-right w-36">Employer Cost</TableHead>
            <TableHead className="w-24">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="bg-gray-50/60 font-medium h-9">
            <TableCell className="font-semibold text-gray-900" sticky>Total</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalIncome)}
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
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalEmployerCost)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          
          {/* Employee rows */}
          {filteredEmployees.map((employee) => (
            <TableRow key={employee.id} className="h-9">
              <TableCell sticky>
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
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium text-gray-900">{formatCurrency(employee.deductions)}</span>
                  <span className="text-xs text-gray-500">-0.20</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium text-gray-900">{formatCurrency(employee.takeHomePay)}</span>
                  <span className="text-xs text-green-600">+0.20</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.employerCost)}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant={approvedEmployees.has(employee.id) ? "secondary" : "outline"}
                  onClick={() => onApproveEmployee(employee.id)}
                  disabled={approvedEmployees.has(employee.id)}
                  className="h-6 px-2 text-xs"
                >
                  {approvedEmployees.has(employee.id) ? "✓" : "Approve"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface EmployerCostTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  viewMode: 'compact' | 'detailed';
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
}

export const EmployerCostTable = ({ employees, summary, viewMode, approvedEmployees, onApproveEmployee }: EmployerCostTableProps) => {
  const filteredEmployees = employees;
  
  // Calculate summary totals for employer cost breakdown
  const totalEmployerNI = employees.reduce((sum, emp) => sum + emp.employerNI, 0);
  const totalEmployerPension = employees.reduce((sum, emp) => sum + emp.employerPension, 0);

  return (
    <div className="space-y-0">
      <Table>
        <TableHeader>
          <TableRow className="h-9">
            <TableHead className="w-48">Employee</TableHead>
            <TableHead className="text-right w-32">Gross Pay</TableHead>
            <TableHead className="text-right w-40">National Insurance</TableHead>
            <TableHead className="text-right w-28">Pension</TableHead>
            <TableHead className="text-right w-40">Total Employer Cost</TableHead>
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
              {formatCurrency(totalEmployerNI)}
            </TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(totalEmployerPension)}
            </TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalEmployerCost)}
            </TableCell>
          </TableRow>
          
          {/* Employee rows */}
          {filteredEmployees.map((employee) => (
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
                {formatCurrency(employee.employerNI)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.employerPension)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.employerCost)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
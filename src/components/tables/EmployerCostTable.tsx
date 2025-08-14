import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface EmployerCostTableProps {
  employees: Employee[];
  summary: PayrollSummary;
}

export const EmployerCostTable = ({ employees, summary }: EmployerCostTableProps) => {
  // Calculate summary totals for employer cost breakdown
  const totalEmployerNI = employees.reduce((sum, emp) => sum + emp.employerNI, 0);
  const totalEmployerPension = employees.reduce((sum, emp) => sum + emp.employerPension, 0);

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gross Pay</TableHead>
            <TableHead className="text-right">National Insurance</TableHead>
            <TableHead className="text-right">Pension</TableHead>
            <TableHead className="text-right">Total employer cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="bg-blue-50/50 font-medium">
            <TableCell className="font-semibold text-gray-900">
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
      
      <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
        1 - {employees.length} of {employees.length} records
      </div>
    </div>
  );
};
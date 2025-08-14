import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface IncomeTableProps {
  employees: Employee[];
  summary: PayrollSummary;
}

export const IncomeTable = ({ employees, summary }: IncomeTableProps) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead className="text-right">Base Pay</TableHead>
            <TableHead className="text-right">Salary basis</TableHead>
            <TableHead className="text-right">Units</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Total income</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="bg-blue-50/50 font-medium">
            <TableCell className="font-semibold text-gray-900">Total</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
            <TableCell></TableCell>
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
                  <span className="font-medium text-gray-900">{employee.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.basePay)}
              </TableCell>
              <TableCell className="text-right text-gray-600">
                {employee.salaryBasis}
              </TableCell>
              <TableCell className="text-right text-gray-600">
                {employee.units}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.rate)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.totalIncome)}
              </TableCell>
              <TableCell className="text-right">
                <Badge 
                  variant="outline" 
                  className="bg-green-50 text-green-700 border-green-200 text-xs"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {employee.status}
                </Badge>
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
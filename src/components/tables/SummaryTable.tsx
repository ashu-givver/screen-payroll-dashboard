import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface SummaryTableProps {
  employees: Employee[];
  summary: PayrollSummary;
}

export const SummaryTable = ({ employees, summary }: SummaryTableProps) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead className="text-right">Income</TableHead>
            <TableHead className="text-right">Deductions</TableHead>
            <TableHead className="text-right">Take home pay</TableHead>
            <TableHead className="text-right">Employer cost</TableHead>
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
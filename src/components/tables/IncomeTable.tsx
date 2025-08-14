import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PayrollTableFilter } from '@/components/PayrollTableFilter';
import { formatCurrency } from '@/lib/formatters';
import { useState } from 'react';

interface IncomeTableProps {
  employees: Employee[];
  summary: PayrollSummary;
}

export const IncomeTable = ({ employees, summary }: IncomeTableProps) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <PayrollTableFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search employees..."
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead className="text-right">Base Pay</TableHead>
            <TableHead className="text-right">Bonus</TableHead>
            <TableHead className="text-right">Commission</TableHead>
            <TableHead className="text-right">Overtime</TableHead>
            <TableHead className="text-right">GIF Flex</TableHead>
            <TableHead className="text-right">Gross Pay</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="bg-blue-50/30 font-medium">
            <TableCell className="font-semibold text-gray-900">Total</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
            <TableCell className="text-right font-semibold text-gray-900">£0.00</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">£0.00</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">£0.00</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">£0.00</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
          </TableRow>
          
          {/* Employee rows */}
          {filteredEmployees.map((employee) => (
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
              <TableCell className="text-right text-gray-600">£0.00</TableCell>
              <TableCell className="text-right text-gray-600">£0.00</TableCell>
              <TableCell className="text-right text-gray-600">£0.00</TableCell>
              <TableCell className="text-right text-gray-600">£0.00</TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.totalIncome)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PayrollTableFilter } from '@/components/PayrollTableFilter';
import { formatCurrency } from '@/lib/formatters';
import { useState } from 'react';

interface EmployerCostTableProps {
  employees: Employee[];
  summary: PayrollSummary;
}

export const EmployerCostTable = ({ employees, summary }: EmployerCostTableProps) => {
  const [searchValue, setSearchValue] = useState('');
  
  // Calculate summary totals for employer cost breakdown
  const totalEmployerNI = employees.reduce((sum, emp) => sum + emp.employerNI, 0);
  const totalEmployerPension = employees.reduce((sum, emp) => sum + emp.employerPension, 0);

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
            <TableHead className="text-right">Gross Pay</TableHead>
            <TableHead className="text-right">National Insurance</TableHead>
            <TableHead className="text-right">Pension</TableHead>
            <TableHead className="text-right">Total Employer Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="bg-blue-50/30 font-medium">
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
import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PayrollTableFilter } from '@/components/PayrollTableFilter';
import { formatCurrency } from '@/lib/formatters';
import { useState } from 'react';

interface EmployerCostTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  viewMode: 'compact' | 'detailed';
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
}

export const EmployerCostTable = ({ employees, summary, viewMode, approvedEmployees, onApproveEmployee }: EmployerCostTableProps) => {
  const [searchValue, setSearchValue] = useState('');
  
  // Calculate summary totals for employer cost breakdown
  const totalEmployerNI = employees.reduce((sum, emp) => sum + emp.employerNI, 0);
  const totalEmployerPension = employees.reduce((sum, emp) => sum + emp.employerPension, 0);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-0">
      <PayrollTableFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search employees..."
      />
      
      <Table>
        <TableHeader>
          <TableRow className="h-9">
            <TableHead className="w-48">Employee</TableHead>
            <TableHead className="text-right w-32">Gross Pay</TableHead>
            <TableHead className="text-right w-40">National Insurance</TableHead>
            <TableHead className="text-right w-28">Pension</TableHead>
            <TableHead className="text-right w-40">Total Employer Cost</TableHead>
            <TableHead className="w-20">Action</TableHead>
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
            <TableCell></TableCell>
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
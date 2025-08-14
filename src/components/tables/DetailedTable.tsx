import { useState, useMemo } from 'react';
import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { EditableCell } from '@/components/EditableCell';
import { SortableHeader, SortDirection } from '@/components/SortableHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface DetailedTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
  onEmployeeUpdate: (employeeId: string, field: string, value: number) => void;
}

export const DetailedTable = ({ employees, summary, approvedEmployees, onApproveEmployee, onEmployeeUpdate }: DetailedTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({ 
    key: '', 
    direction: null 
  });

  // Sorting logic
  const sortedEmployees = useMemo(() => {
    if (!sortConfig.direction || !sortConfig.key) {
      return employees;
    }

    return [...employees].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof Employee];
      let bValue: any = b[sortConfig.key as keyof Employee];

      // Handle string sorting (like employee names)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string sorting
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [employees, sortConfig]);

  const handleSort = (key: string, direction: SortDirection) => {
    setSortConfig({ key, direction });
  };

  // Calculate comparison with previous month for any element
  const getElementChange = (current: number, previous: number) => {
    if (previous === 0) return { amount: 0, percentage: 0 };
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { amount: change, percentage };
  };

  // Calculate summary totals for all elements
  const totalBasePay = employees.reduce((sum, emp) => sum + emp.basePay, 0);
  const totalBonus = employees.reduce((sum, emp) => sum + emp.bonus, 0);
  const totalCommission = employees.reduce((sum, emp) => sum + emp.commission, 0);
  const totalOvertime = employees.reduce((sum, emp) => sum + emp.overtime, 0);
  const totalGifFlex = employees.reduce((sum, emp) => sum + emp.gifFlex, 0);
  const totalOnCall = employees.reduce((sum, emp) => sum + emp.onCall, 0);
  const totalPaye = employees.reduce((sum, emp) => sum + emp.paye, 0);
  const totalNI = employees.reduce((sum, emp) => sum + emp.ni, 0);
  const totalPension = employees.reduce((sum, emp) => sum + emp.pension, 0);
  const totalStudentLoan = employees.reduce((sum, emp) => sum + emp.studentLoan, 0);
  const totalPostgradLoan = employees.reduce((sum, emp) => sum + emp.postgradLoan, 0);
  const totalEmployerNI = employees.reduce((sum, emp) => sum + emp.employerNI, 0);
  const totalEmployerPension = employees.reduce((sum, emp) => sum + emp.employerPension, 0);

  return (
    <div className="space-y-0">
      <div className="overflow-x-auto border border-gray-300 rounded-lg bg-white">
        <Table className="border-separate border-spacing-0">
          <TableHeader className="sticky top-0 bg-gray-50 z-10">
            <TableRow className="border-b border-gray-300">
              <TableHead className="w-32 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="name" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="left"
                >
                  Employee
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-20 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="basePay" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Base Pay
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-18 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="bonus" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Bonus
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-20 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="commission" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Commission
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-18 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="overtime" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Overtime
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-18 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="gifFlex" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  GIF Flex
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-16 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="onCall" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  OnCall
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-20 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="totalIncome" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Gross Pay
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-16 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="paye" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  PAYE
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-14 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="ni" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  NI
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-18 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="pension" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Pension
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-20 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="studentLoan" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Student Loan
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-20 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="postgradLoan" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Postgrad Loan
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-18 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="employerNI" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Emp NI
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right w-20 border-r border-gray-300 bg-gray-50 p-0">
                <SortableHeader 
                  sortKey="employerPension" 
                  currentSort={sortConfig} 
                  onSort={handleSort}
                  className="h-8 text-xs font-semibold text-gray-700"
                  align="right"
                >
                  Emp Pension
                </SortableHeader>
              </TableHead>
              <TableHead className="w-16 border-gray-300 bg-gray-50 p-0">
                <div className="h-8 flex items-center justify-center px-2 text-xs font-semibold text-gray-700">
                  Action
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Total row */}
            <TableRow className="bg-gray-200/80 font-medium h-12 border-b border-gray-300">
              <TableCell className="font-semibold text-gray-900 text-xs px-2 py-3 border-r border-gray-300">Total</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalBasePay)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalBonus)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalCommission)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalOvertime)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalGifFlex)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalOnCall)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(summary.totalIncome)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalPaye)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalNI)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalPension)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalStudentLoan)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalPostgradLoan)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalEmployerNI)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(totalEmployerPension)}</TableCell>
              <TableCell className="px-1 py-3 border-r border-gray-300"></TableCell>
            </TableRow>
            
            {/* Employee rows */}
            {sortedEmployees.map((employee, index) => {
              return (
                <TableRow key={employee.id} className="h-12 border-b border-gray-300 hover:bg-blue-50/30 transition-colors">
                  <TableCell className="px-2 py-3 border-r border-gray-300">
                    <div className="flex items-center gap-1">
                      <EmployeeAvatar 
                        name={employee.name}
                        initials={employee.initials}
                        size="sm"
                      />
                      <span className="font-medium text-gray-900 text-xs truncate">{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900 text-xs px-1 py-3 border-r border-gray-300">
                    <div className="flex flex-col">
                      <EditableCell
                        value={employee.basePay}
                        onSave={(newValue) => onEmployeeUpdate(employee.id, 'basePay', newValue)}
                        field="basePay"
                        employeeName={employee.name}
                        className="font-medium"
                        showZeroAs={formatCurrency(0)}
                      />
                      {employee.previousMonth && (
                        <span className="text-xs text-gray-500">
                          {getElementChange(employee.basePay, employee.previousMonth.basePay).amount !== 0 && (
                            <>
                              {getElementChange(employee.basePay, employee.previousMonth.basePay).amount > 0 ? '+' : ''}
                              {getElementChange(employee.basePay, employee.previousMonth.basePay).percentage.toFixed(1)}%
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">
                    <div className="flex flex-col">
                      <EditableCell
                        value={employee.bonus}
                        onSave={(newValue) => onEmployeeUpdate(employee.id, 'bonus', newValue)}
                        field="bonus"
                        employeeName={employee.name}
                      />
                      {employee.previousMonth && employee.bonus !== employee.previousMonth.bonus && (
                        <span className={`text-xs ${employee.bonus > employee.previousMonth.bonus ? 'text-green-600' : 'text-red-600'}`}>
                          {employee.bonus > employee.previousMonth.bonus ? '+' : ''}{formatCurrency(Math.abs(employee.bonus - employee.previousMonth.bonus))}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">
                    <EditableCell
                      value={employee.commission}
                      onSave={(newValue) => onEmployeeUpdate(employee.id, 'commission', newValue)}
                      field="commission"
                      employeeName={employee.name}
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">
                    <EditableCell
                      value={employee.overtime}
                      onSave={(newValue) => onEmployeeUpdate(employee.id, 'overtime', newValue)}
                      field="overtime"
                      employeeName={employee.name}
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">
                    <EditableCell
                      value={employee.gifFlex}
                      onSave={(newValue) => onEmployeeUpdate(employee.id, 'gifFlex', newValue)}
                      field="gifFlex"
                      employeeName={employee.name}
                    />
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">
                    <div className="flex flex-col">
                      <EditableCell
                        value={employee.onCall}
                        onSave={(newValue) => onEmployeeUpdate(employee.id, 'onCall', newValue)}
                        field="onCall"
                        employeeName={employee.name}
                      />
                      {employee.previousMonth && employee.onCall !== employee.previousMonth.onCall && (
                        <span className={`text-xs ${employee.onCall > employee.previousMonth.onCall ? 'text-green-600' : 'text-red-600'}`}>
                          {employee.onCall > employee.previousMonth.onCall ? '+' : ''}{formatCurrency(Math.abs(employee.onCall - employee.previousMonth.onCall))}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900 text-xs px-1 py-3 border-r border-gray-300">
                    <div className="flex flex-col">
                      <span>{formatCurrency(employee.totalIncome)}</span>
                      {employee.previousMonth && (
                        <span className={`text-xs ${employee.totalIncome > employee.previousMonth.totalIncome ? 'text-green-600' : 'text-red-600'}`}>
                          {employee.totalIncome > employee.previousMonth.totalIncome ? '+' : ''}{formatCurrency(Math.abs(employee.totalIncome - employee.previousMonth.totalIncome))}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(employee.paye)}</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(employee.ni)}</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(employee.pension)}</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(employee.studentLoan)}</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(employee.postgradLoan)}</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(employee.employerNI)}</TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1 py-3 border-r border-gray-300">{formatCurrency(employee.employerPension)}</TableCell>
                  <TableCell className="px-1 py-3 border-r border-gray-300">
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
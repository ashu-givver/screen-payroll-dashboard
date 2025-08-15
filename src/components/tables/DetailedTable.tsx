import { useState, useMemo } from 'react';
import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { EditableCell } from '@/components/EditableCell';
import { SortableHeader, SortDirection } from '@/components/SortableHeader';
import { Button } from '@/components/ui/button';
import { NotionTable, NotionTableHeader, NotionTableBody, NotionTableRow, NotionTableHead, NotionTableCell } from '@/components/NotionTable';
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
    <NotionTable>
      <NotionTableHeader>
        <NotionTableRow>
          <NotionTableHead width="128px" sticky>
            <SortableHeader 
              sortKey="name" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="left"
            >
              Employee
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="64px" align="center">
            Action
          </NotionTableHead>
          <NotionTableHead width="80px" align="right">
            <SortableHeader 
              sortKey="basePay" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Base Pay
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="72px" align="right">
            <SortableHeader 
              sortKey="bonus" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Bonus
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="80px" align="right">
            <SortableHeader 
              sortKey="commission" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Commission
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="72px" align="right">
            <SortableHeader 
              sortKey="overtime" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Overtime
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="72px" align="right">
            <SortableHeader 
              sortKey="gifFlex" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              GIF Flex
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="64px" align="right">
            <SortableHeader 
              sortKey="onCall" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              OnCall
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="80px" align="right">
            <SortableHeader 
              sortKey="totalIncome" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Gross Pay
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="64px" align="right">
            <SortableHeader 
              sortKey="paye" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              PAYE
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="56px" align="right">
            <SortableHeader 
              sortKey="ni" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              NI
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="72px" align="right">
            <SortableHeader 
              sortKey="pension" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Pension
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="80px" align="right">
            <SortableHeader 
              sortKey="studentLoan" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Student Loan
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="80px" align="right">
            <SortableHeader 
              sortKey="postgradLoan" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Postgrad Loan
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="72px" align="right">
            <SortableHeader 
              sortKey="employerNI" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Emp NI
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="80px" align="right">
            <SortableHeader 
              sortKey="employerPension" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="right"
            >
              Emp Pension
            </SortableHeader>
          </NotionTableHead>
        </NotionTableRow>
      </NotionTableHeader>
      <NotionTableBody>
        {/* Total row */}
        <NotionTableRow className="bg-muted/40 font-medium">
          <NotionTableCell className="font-semibold" sticky>Total</NotionTableCell>
          <NotionTableCell align="center">
            <Button
              size="sm"
              variant="outline"
              disabled
              className="h-6 px-2 text-xs opacity-50"
            >
              -
            </Button>
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalBasePay)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalBonus)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalCommission)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalOvertime)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalGifFlex)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalOnCall)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(summary.totalIncome)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalPaye)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalNI)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalPension)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalStudentLoan)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalPostgradLoan)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalEmployerNI)}</NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">{formatCurrency(totalEmployerPension)}</NotionTableCell>
        </NotionTableRow>
        
        {/* Employee rows */}
        {sortedEmployees.map((employee, index) => {
          return (
            <NotionTableRow key={employee.id}>
              <NotionTableCell sticky>
                <div className="flex items-center gap-1">
                  <EmployeeAvatar 
                    name={employee.name}
                    initials={employee.initials}
                    size="sm"
                  />
                  <span className="font-medium text-xs truncate">{employee.name}</span>
                </div>
              </NotionTableCell>
              <NotionTableCell align="center">
                <Button
                  size="sm"
                  variant={approvedEmployees.has(employee.id) ? "secondary" : "outline"}
                  onClick={() => onApproveEmployee(employee.id)}
                  disabled={approvedEmployees.has(employee.id)}
                  className="h-6 px-2 text-xs"
                >
                  {approvedEmployees.has(employee.id) ? "✓" : "Approve"}
                </Button>
              </NotionTableCell>
              <NotionTableCell align="right" className="font-medium">
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
              </NotionTableCell>
              <NotionTableCell align="right">
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
              </NotionTableCell>
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.commission}
                  onSave={(newValue) => onEmployeeUpdate(employee.id, 'commission', newValue)}
                  field="commission"
                  employeeName={employee.name}
                />
              </NotionTableCell>
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.overtime}
                  onSave={(newValue) => onEmployeeUpdate(employee.id, 'overtime', newValue)}
                  field="overtime"
                  employeeName={employee.name}
                />
              </NotionTableCell>
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.gifFlex}
                  onSave={(newValue) => onEmployeeUpdate(employee.id, 'gifFlex', newValue)}
                  field="gifFlex"
                  employeeName={employee.name}
                />
              </NotionTableCell>
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.onCall}
                  onSave={(newValue) => onEmployeeUpdate(employee.id, 'onCall', newValue)}
                  field="onCall"
                  employeeName={employee.name}
                />
              </NotionTableCell>
              <NotionTableCell align="right" className="font-medium">
                {formatCurrency(employee.totalIncome)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.paye)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.ni)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.pension)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.studentLoan)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.postgradLoan)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.employerNI)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.employerPension)}
              </NotionTableCell>
            </NotionTableRow>
          );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
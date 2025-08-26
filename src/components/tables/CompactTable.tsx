import { useState, useMemo } from 'react';
import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { EditableCell } from '@/components/EditableCell';
import { SortableHeader, SortDirection } from '@/components/SortableHeader';
import { TagsCell } from '@/components/TagsCell';
import { Button } from '@/components/ui/button';
import { NotionTable, NotionTableHeader, NotionTableBody, NotionTableRow, NotionTableHead, NotionTableCell } from '@/components/NotionTable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/formatters';

interface CompactTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
  onEmployeeUpdate: (employeeId: string, field: string, value: number) => void;
  onTagClick?: (tagCategory: string) => void;
}

export const CompactTable = ({ employees, summary, approvedEmployees, onApproveEmployee, onEmployeeUpdate, onTagClick }: CompactTableProps) => {
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
  const filteredEmployees = employees;

  // Calculate comparison with previous month for Gross Pay only
  const getGrossPayChange = (employee: Employee) => {
    if (!employee.previousMonth) return { amount: 0, percentage: 0 };
    const change = employee.totalIncome - employee.previousMonth.totalIncome;
    const percentage = employee.previousMonth.totalIncome > 0 
      ? (change / employee.previousMonth.totalIncome) * 100 
      : 0;
    return { amount: change, percentage };
  };

  // Get color class based on percentage difference
  const getPercentageColorClass = (percentage: number) => {
    const absPercentage = Math.abs(percentage);
    
    if (absPercentage < 3) {
      return 'text-green-700 bg-green-50 border border-green-200';
    } else if (absPercentage < 5) {
      return 'text-yellow-700 bg-yellow-50 border border-yellow-200';
    } else if (absPercentage < 7) {
      return 'text-orange-700 bg-orange-50 border border-orange-200';
    } else if (absPercentage <= 10) {
      return 'text-red-700 bg-red-50 border border-red-200';
    } else {
      // For values > 10%, use red with stronger styling
      return 'text-red-800 bg-red-100 border border-red-300';
    }
  };

  // Get tooltip information about pay differences
  const getPayDifferenceTooltip = (employee: Employee) => {
    if (!employee.previousMonth) return 'No previous data available';
    
    const changes = [];
    
    // Check for changes in different components
    const baseDiff = employee.basePay - employee.previousMonth.basePay;
    if (Math.abs(baseDiff) > 0) {
      changes.push(`Salary: ${baseDiff > 0 ? '+' : ''}${formatCurrency(baseDiff)}`);
    }
    
    const bonusDiff = employee.bonus - employee.previousMonth.bonus;
    if (Math.abs(bonusDiff) > 0) {
      changes.push(`Bonus: ${bonusDiff > 0 ? '+' : ''}${formatCurrency(bonusDiff)}`);
    }
    
    const overtimeDiff = employee.overtime - employee.previousMonth.overtime;
    if (Math.abs(overtimeDiff) > 0) {
      changes.push(`Overtime: ${overtimeDiff > 0 ? '+' : ''}${formatCurrency(overtimeDiff)}`);
    }
    
    const commissionDiff = employee.commission - employee.previousMonth.commission;
    if (Math.abs(commissionDiff) > 0) {
      changes.push(`Commission: ${commissionDiff > 0 ? '+' : ''}${formatCurrency(commissionDiff)}`);
    }
    
    const flexDiff = employee.gifFlex - employee.previousMonth.gifFlex;
    if (Math.abs(flexDiff) > 0) {
      changes.push(`GIF Flex: ${flexDiff > 0 ? '+' : ''}${formatCurrency(flexDiff)}`);
    }
    
    const onCallDiff = employee.onCall - employee.previousMonth.onCall;
    if (Math.abs(onCallDiff) > 0) {
      changes.push(`OnCall: ${onCallDiff > 0 ? '+' : ''}${formatCurrency(onCallDiff)}`);
    }
    
    return changes.length > 0 ? changes.join(', ') : 'No changes in pay components';
  };

  // Calculate summary totals for all pay elements
  const totalBasePay = employees.reduce((sum, emp) => sum + emp.basePay, 0);
  const totalBonus = employees.reduce((sum, emp) => sum + emp.bonus, 0);
  const totalCommission = employees.reduce((sum, emp) => sum + emp.commission, 0);
  const totalOvertime = employees.reduce((sum, emp) => sum + emp.overtime, 0);
  const totalGifFlex = employees.reduce((sum, emp) => sum + emp.gifFlex, 0);
  const totalOnCall = employees.reduce((sum, emp) => sum + emp.onCall, 0);

  return (
    <NotionTable>
      <NotionTableHeader>
        <NotionTableRow>
          <NotionTableHead width="160px" sticky>
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
          <NotionTableHead width="100px" align="center">
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium">Approval</span>
              <span className="text-xs text-muted-foreground font-normal">Approve each employee for this payroll</span>
            </div>
          </NotionTableHead>
          <NotionTableHead width="100px" align="right">
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
          <NotionTableHead width="80px" align="right">
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
          <NotionTableHead width="100px" align="right">
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
          <NotionTableHead width="80px" align="right">
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
          <NotionTableHead width="80px" align="right">
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
          <NotionTableHead width="80px" align="right">
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
          <NotionTableHead width="110px" align="right">
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
          <NotionTableHead width="120px" align="right">
            Gross Pay Difference
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
               variant="ghost"
               disabled
               className="h-6 px-3 text-xs font-medium border bg-[#E5E7EB] text-[#6B7280] border-[#E5E7EB] cursor-not-allowed"
               aria-label="Total row - no action available"
             >
               -
             </Button>
           </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalBasePay)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalBonus)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalCommission)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalOvertime)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalGifFlex)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalOnCall)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(summary.totalIncome)}
          </NotionTableCell>
          <NotionTableCell align="right">
            <span className="text-green-600 font-medium">+2.3%</span>
          </NotionTableCell>
        </NotionTableRow>
            
        {/* Employee rows */}
        {sortedEmployees.map((employee, index) => {
          const grossPayChange = getGrossPayChange(employee);
          const payDifferenceTooltip = getPayDifferenceTooltip(employee);
          return (
            <NotionTableRow key={employee.id}>
              <NotionTableCell sticky>
                <div className="flex items-center gap-2">
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
                  variant="ghost"
                  onClick={() => onApproveEmployee(employee.id)}
                  disabled={false}
                  className={`h-6 px-3 text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 ${
                    approvedEmployees.has(employee.id)
                      ? 'bg-[#16A34A] text-white border-[#16A34A] hover:bg-[#15803D] hover:border-[#15803D]'
                      : 'bg-transparent text-[#374151] border-[#D1D5DB] hover:border-[#16A34A] hover:text-[#16A34A]'
                  }`}
                  aria-label={
                    approvedEmployees.has(employee.id) 
                      ? `${employee.name} approved for payroll`
                      : `Approve payroll for ${employee.name}`
                  }
                  title={
                    approvedEmployees.has(employee.id)
                      ? 'Click to unapprove'
                      : 'Mark as approved for payroll'
                  }
                >
                  {approvedEmployees.has(employee.id) ? "Approved ✓" : "Approve"}
                </Button>
              </NotionTableCell>
              <NotionTableCell align="right" className="font-medium">
                <EditableCell
                  value={employee.basePay}
                  onSave={(newValue) => onEmployeeUpdate(employee.id, 'basePay', newValue)}
                  field="basePay"
                  employeeName={employee.name}
                  className="font-medium"
                />
              </NotionTableCell>
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.bonus}
                  onSave={(newValue) => onEmployeeUpdate(employee.id, 'bonus', newValue)}
                  field="bonus"
                  employeeName={employee.name}
                />
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
                {grossPayChange.percentage !== 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium cursor-help ${getPercentageColorClass(grossPayChange.percentage)}`}>
                          {grossPayChange.percentage > 0 ? '+' : ''}{grossPayChange.percentage.toFixed(1)}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">{payDifferenceTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </NotionTableCell>
            </NotionTableRow>
          );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
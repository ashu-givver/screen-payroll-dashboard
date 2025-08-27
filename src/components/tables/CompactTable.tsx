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

  // Get tooltip information about pay differences (concise reasons)
  const getPayDifferenceTooltip = (employee: Employee) => {
    if (!employee.previousMonth) return 'No previous data';
    
    const reasons = [];
    
    // Check for changes in different components with thresholds
    const baseDiff = employee.basePay - employee.previousMonth.basePay;
    if (Math.abs(baseDiff) > 50) {
      reasons.push('Salary change');
    }
    
    const bonusDiff = employee.bonus - employee.previousMonth.bonus;
    if (Math.abs(bonusDiff) > 0) {
      reasons.push('Bonus');
    }
    
    const overtimeDiff = employee.overtime - employee.previousMonth.overtime;
    if (Math.abs(overtimeDiff) > 0) {
      reasons.push('Overtime');
    }
    
    const commissionDiff = employee.commission - employee.previousMonth.commission;
    if (Math.abs(commissionDiff) > 0) {
      reasons.push('Commission');
    }
    
    const flexDiff = employee.gifFlex - employee.previousMonth.gifFlex;
    if (Math.abs(flexDiff) > 0) {
      reasons.push('GIF Flex');
    }
    
    const onCallDiff = employee.onCall - employee.previousMonth.onCall;
    if (Math.abs(onCallDiff) > 0) {
      reasons.push('On call');
    }
    
    // Add mock statutory reasons based on employee ID for demo
    if (employee.id === '1') reasons.push('Tax code');
    if (employee.id === '3') reasons.push('Maternity');
    if (employee.id === '5') reasons.push('Sickness');
    if (employee.id === '7') reasons.push('Pension change');
    
    return reasons.length > 0 ? reasons.join(', ') : 'Minor adjustments';
  };

  // Calculate summary totals for all pay elements
  const totalBasePay = employees.reduce((sum, emp) => sum + emp.basePay, 0);
  const totalBonus = employees.reduce((sum, emp) => sum + emp.bonus, 0);
  const totalCommission = employees.reduce((sum, emp) => sum + emp.commission, 0);
  const totalOvertime = employees.reduce((sum, emp) => sum + emp.overtime, 0);
  const totalGifFlex = employees.reduce((sum, emp) => sum + emp.gifFlex, 0);
  const totalOnCall = employees.reduce((sum, emp) => sum + emp.onCall, 0);

  // Helper function to calculate percentage change for any field
  const getFieldPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? { percentage: 100, hasChange: true } : { percentage: 0, hasChange: false };
    const percentage = ((current - previous) / previous) * 100;
    return { percentage, hasChange: Math.abs(percentage) > 0.1 };
  };

  // Helper function to get color class for percentage changes
  const getChangeColorClass = (percentage: number, hasChange: boolean) => {
    if (!hasChange) return 'text-muted-foreground';
    return percentage > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <NotionTable>
      <NotionTableHeader>
        <NotionTableRow>
          <NotionTableHead width="140px" sticky>
            <SortableHeader 
              sortKey="name" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="left"
            >
              Name
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="120px">
            <SortableHeader 
              sortKey="department" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-medium"
              align="left"
            >
              Department
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="100px" align="center" sticky>
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium">Approval</span>
              <span className="text-xs text-muted-foreground font-normal">Approve each employee for this payroll</span>
            </div>
          </NotionTableHead>
          <NotionTableHead width="120px" align="right">
            Gross Pay Difference %
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
          <NotionTableHead width="90px" align="right">
            <div className="flex flex-col items-end">
              <SortableHeader 
                sortKey="bonus" 
                currentSort={sortConfig} 
                onSort={handleSort}
                className="text-xs font-medium"
                align="right"
              >
                Bonus
              </SortableHeader>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </NotionTableHead>
          <NotionTableHead width="110px" align="right">
            <div className="flex flex-col items-end">
              <SortableHeader 
                sortKey="commission" 
                currentSort={sortConfig} 
                onSort={handleSort}
                className="text-xs font-medium"
                align="right"
              >
                Commission
              </SortableHeader>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </NotionTableHead>
          <NotionTableHead width="90px" align="right">
            <div className="flex flex-col items-end">
              <SortableHeader 
                sortKey="overtime" 
                currentSort={sortConfig} 
                onSort={handleSort}
                className="text-xs font-medium"
                align="right"
              >
                Overtime
              </SortableHeader>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </NotionTableHead>
          <NotionTableHead width="90px" align="right">
            <div className="flex flex-col items-end">
              <SortableHeader 
                sortKey="gifFlex" 
                currentSort={sortConfig} 
                onSort={handleSort}
                className="text-xs font-medium"
                align="right"
              >
                GIF Flex
              </SortableHeader>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </NotionTableHead>
          <NotionTableHead width="90px" align="right">
            <div className="flex flex-col items-end">
              <SortableHeader 
                sortKey="onCall" 
                currentSort={sortConfig} 
                onSort={handleSort}
                className="text-xs font-medium"
                align="right"
              >
                OnCall
              </SortableHeader>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </NotionTableHead>
          <NotionTableHead width="110px" align="right" sticky>
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
        </NotionTableRow>
      </NotionTableHeader>
      <NotionTableBody>
        {/* Total row */}
        <NotionTableRow className="bg-muted/40 font-medium">
          <NotionTableCell className="font-semibold" sticky>Total</NotionTableCell>
          <NotionTableCell className="font-semibold">All Departments</NotionTableCell>
           <NotionTableCell align="center" sticky>
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
           <NotionTableCell align="right">
             <span className="text-green-700 bg-green-50 border border-green-200 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium">+2.3%</span>
           </NotionTableCell>
           <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalBasePay)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalBonus)}</span>
              <span className="text-xs text-green-600">+8.2%</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalCommission)}</span>
              <span className="text-xs text-green-600">+12.1%</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalOvertime)}</span>
              <span className="text-xs text-red-600">-5.3%</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalGifFlex)}</span>
              <span className="text-xs text-green-600">+22.0%</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalOnCall)}</span>
              <span className="text-xs text-muted-foreground">—</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold" sticky>
            {formatCurrency(summary.totalIncome)}
          </NotionTableCell>
        </NotionTableRow>
            
        {/* Employee rows */}
        {sortedEmployees.map((employee, index) => {
          const grossPayChange = getGrossPayChange(employee);
          const payDifferenceTooltip = getPayDifferenceTooltip(employee);
          
          // Calculate percentage changes for each pay component
          const bonusChange = employee.previousMonth ? getFieldPercentageChange(employee.bonus, employee.previousMonth.bonus) : { percentage: 0, hasChange: false };
          const commissionChange = employee.previousMonth ? getFieldPercentageChange(employee.commission, employee.previousMonth.commission) : { percentage: 0, hasChange: false };
          const overtimeChange = employee.previousMonth ? getFieldPercentageChange(employee.overtime, employee.previousMonth.overtime) : { percentage: 0, hasChange: false };
          const gifFlexChange = employee.previousMonth ? getFieldPercentageChange(employee.gifFlex, employee.previousMonth.gifFlex) : { percentage: 0, hasChange: false };
          const onCallChange = employee.previousMonth ? getFieldPercentageChange(employee.onCall, employee.previousMonth.onCall) : { percentage: 0, hasChange: false };
          
          return (
            <NotionTableRow key={employee.id} className={index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}>
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
              <NotionTableCell>
                <span className="text-xs text-muted-foreground">{employee.department}</span>
              </NotionTableCell>
              <NotionTableCell align="center" sticky>
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
              <NotionTableCell align="right">
                {grossPayChange.percentage !== 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium cursor-help ${getPercentageColorClass(grossPayChange.percentage)}`}>
                          {grossPayChange.percentage > 0 ? '+' : ''}{grossPayChange.percentage.toFixed(1)}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white border-gray-800 shadow-lg px-3 py-2 text-xs rounded-lg">
                        <p>{payDifferenceTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
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
                <div className="flex flex-col items-end">
                  <EditableCell
                    value={employee.bonus}
                    onSave={(newValue) => onEmployeeUpdate(employee.id, 'bonus', newValue)}
                    field="bonus"
                    employeeName={employee.name}
                  />
                  {bonusChange.hasChange ? (
                    <span className={`text-xs ${getChangeColorClass(bonusChange.percentage, bonusChange.hasChange)}`}>
                      {bonusChange.percentage > 0 ? '+' : ''}{bonusChange.percentage.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </NotionTableCell>
              <NotionTableCell align="right">
                <div className="flex flex-col items-end">
                  <EditableCell
                    value={employee.commission}
                    onSave={(newValue) => onEmployeeUpdate(employee.id, 'commission', newValue)}
                    field="commission"
                    employeeName={employee.name}
                  />
                  {commissionChange.hasChange ? (
                    <span className={`text-xs ${getChangeColorClass(commissionChange.percentage, commissionChange.hasChange)}`}>
                      {commissionChange.percentage > 0 ? '+' : ''}{commissionChange.percentage.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </NotionTableCell>
              <NotionTableCell align="right">
                <div className="flex flex-col items-end">
                  <EditableCell
                    value={employee.overtime}
                    onSave={(newValue) => onEmployeeUpdate(employee.id, 'overtime', newValue)}
                    field="overtime"
                    employeeName={employee.name}
                  />
                  {overtimeChange.hasChange ? (
                    <span className={`text-xs ${getChangeColorClass(overtimeChange.percentage, overtimeChange.hasChange)}`}>
                      {overtimeChange.percentage > 0 ? '+' : ''}{overtimeChange.percentage.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </NotionTableCell>
              <NotionTableCell align="right">
                <div className="flex flex-col items-end">
                  <EditableCell
                    value={employee.gifFlex}
                    onSave={(newValue) => onEmployeeUpdate(employee.id, 'gifFlex', newValue)}
                    field="gifFlex"
                    employeeName={employee.name}
                  />
                  {gifFlexChange.hasChange ? (
                    <span className={`text-xs ${getChangeColorClass(gifFlexChange.percentage, gifFlexChange.hasChange)}`}>
                      {gifFlexChange.percentage > 0 ? '+' : ''}{gifFlexChange.percentage.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </NotionTableCell>
              <NotionTableCell align="right">
                <div className="flex flex-col items-end">
                  <EditableCell
                    value={employee.onCall}
                    onSave={(newValue) => onEmployeeUpdate(employee.id, 'onCall', newValue)}
                    field="onCall"
                    employeeName={employee.name}
                  />
                  {onCallChange.hasChange ? (
                    <span className={`text-xs ${getChangeColorClass(onCallChange.percentage, onCallChange.hasChange)}`}>
                      {onCallChange.percentage > 0 ? '+' : ''}{onCallChange.percentage.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </NotionTableCell>
              <NotionTableCell align="right" className="font-medium" sticky>
                {formatCurrency(employee.totalIncome)}
              </NotionTableCell>
            </NotionTableRow>
          );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
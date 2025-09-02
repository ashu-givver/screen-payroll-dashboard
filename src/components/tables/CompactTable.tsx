import { useState, useMemo } from 'react';
import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { EditableCell } from '@/components/EditableCell';
import { SortableHeader, SortDirection } from '@/components/SortableHeader';
import { TagsCell } from '@/components/TagsCell';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check } from 'lucide-react';
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

  const handleSort = (key: string, direction: SortDirection) => {
    setSortConfig({ key, direction });
  };

  // Calculate comparison with previous month for Gross Pay only
  const getGrossPayChange = (employee: Employee) => {
    if (!employee.previousMonth) return { amount: 0, percentage: 0 };
    const change = employee.totalIncome - employee.previousMonth.totalIncome;
    const percentage = employee.previousMonth.totalIncome > 0 
      ? (change / employee.previousMonth.totalIncome) * 100 
      : 0;
    return { amount: change, percentage };
  };

  // Sorting logic with priority for employees with gross pay differences
  const sortedEmployees = useMemo(() => {
    // First, separate employees with and without gross pay differences
    const employeesWithDifferences: Employee[] = [];
    const employeesWithoutDifferences: Employee[] = [];

    employees.forEach(employee => {
      const grossPayChange = getGrossPayChange(employee);
      if (Math.abs(grossPayChange.percentage) > 0.1) { // Consider changes > 0.1% as significant
        employeesWithDifferences.push(employee);
      } else {
        employeesWithoutDifferences.push(employee);
      }
    });

    // Sort employees with differences by absolute percentage change (highest first)
    employeesWithDifferences.sort((a, b) => {
      const aChange = Math.abs(getGrossPayChange(a).percentage);
      const bChange = Math.abs(getGrossPayChange(b).percentage);
      return bChange - aChange;
    });

    // Apply secondary sorting if specified
    let sortedWithDifferences = employeesWithDifferences;
    let sortedWithoutDifferences = employeesWithoutDifferences;

    if (sortConfig.direction && sortConfig.key) {
      const sortFunction = (a: Employee, b: Employee) => {
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
      };

      sortedWithDifferences = [...employeesWithDifferences].sort(sortFunction);
      sortedWithoutDifferences = [...employeesWithoutDifferences].sort(sortFunction);
    }

    // Return employees with differences first, then without differences
    return [...sortedWithDifferences, ...sortedWithoutDifferences];
  }, [employees, sortConfig]);

  const filteredEmployees = employees;

  // Get background color based on percentage change
  const getChangeBackgroundClass = (percentage: number, hasChange: boolean) => {
    if (!hasChange) return '';
    return percentage > 0 ? 'bg-green-50/60' : 'bg-red-50/60';
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

  // Traffic light color system for Gross Pay Difference with background and text colors
  const getGrossPayDifferenceClasses = (percentage: number) => {
    const absPercentage = Math.abs(percentage);
    if (absPercentage >= 5) {
      return {
        cellClass: 'bg-red-50/80',
        textClass: 'text-red-700 font-semibold'
      };
    }
    if (absPercentage >= 3) {
      return {
        cellClass: 'bg-orange-50/80',
        textClass: 'text-orange-700 font-semibold'
      };
    }
    return {
      cellClass: 'bg-green-50/80',
      textClass: 'text-green-700 font-semibold'
    };
  };

  return (
    <NotionTable>
      <NotionTableHeader>
        <NotionTableRow>
          <NotionTableHead width="40px" align="center" sticky>
            <span className="text-xs font-bold uppercase tracking-wide">APPROVE</span>
          </NotionTableHead>
          <NotionTableHead width="160px" sticky>
            <SortableHeader 
              sortKey="name" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-bold uppercase tracking-wide"
              align="left"
            >
              NAME
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="120px" sticky>
            <SortableHeader 
              sortKey="department" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-bold uppercase tracking-wide"
              align="left"
            >
              DEPARTMENT
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="120px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">GROSS PAY DIFF %</span>
          </NotionTableHead>
          <NotionTableHead width="100px" align="right">
            <SortableHeader 
              sortKey="basePay" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-bold uppercase tracking-wide"
              align="right"
            >
              BASE PAY
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead width="90px" align="right">
            <div className="flex flex-col items-end">
              <SortableHeader 
                sortKey="bonus" 
                currentSort={sortConfig} 
                onSort={handleSort}
                className="text-xs font-bold uppercase tracking-wide"
                align="right"
              >
                BONUS
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
                className="text-xs font-bold uppercase tracking-wide"
                align="right"
              >
                COMMISSION
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
                className="text-xs font-bold uppercase tracking-wide"
                align="right"
              >
                OVERTIME
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
                className="text-xs font-bold uppercase tracking-wide"
                align="right"
              >
                GIF FLEX
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
                className="text-xs font-bold uppercase tracking-wide"
                align="right"
              >
                ONCALL
              </SortableHeader>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </NotionTableHead>
          <NotionTableHead width="110px" align="right">
            <SortableHeader 
              sortKey="totalIncome" 
              currentSort={sortConfig} 
              onSort={handleSort}
              className="text-xs font-bold uppercase tracking-wide"
              align="right"
            >
              GROSS PAY
            </SortableHeader>
          </NotionTableHead>
        </NotionTableRow>
      </NotionTableHeader>
      <NotionTableBody>
        {/* Total row */}
        <NotionTableRow className="bg-muted/30 font-medium text-muted-foreground">
          <NotionTableCell align="center" sticky>
            <div className="w-4 h-4" />
          </NotionTableCell>
          <NotionTableCell className="text-muted-foreground" sticky>Total</NotionTableCell>
          <NotionTableCell className="text-muted-foreground" sticky>All Departments</NotionTableCell>
          <NotionTableCell align="right">
            <span className="text-xs font-medium text-muted-foreground">+2.3%</span>
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(totalBasePay)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalBonus)}</span>
              <span className="text-xs text-green-600/70">+8.2%</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalCommission)}</span>
              <span className="text-xs text-green-600/70">+12.1%</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalOvertime)}</span>
              <span className="text-xs text-red-600/70">-5.3%</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalGifFlex)}</span>
              <span className="text-xs text-green-600/70">+22.0%</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            <div className="flex flex-col items-end">
              <span>{formatCurrency(totalOnCall)}</span>
              <span className="text-xs text-muted-foreground/70">—</span>
            </div>
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(summary.totalIncome)}
          </NotionTableCell>
        </NotionTableRow>
            
        {/* Employee rows */}
        {sortedEmployees.map((employee, index) => {
          const grossPayChange = getGrossPayChange(employee);
          const payDifferenceTooltip = getPayDifferenceTooltip(employee);
          
          // Determine if this employee should show detailed differences (first 20 with differences)
          const shouldShowDifference = index < 20 && Math.abs(grossPayChange.percentage) > 0.1;
          const displayedGrossPayChange = shouldShowDifference ? grossPayChange : { amount: 0, percentage: 0 };
          
          // Calculate percentage changes for each pay component
          const bonusChange = employee.previousMonth ? getFieldPercentageChange(employee.bonus, employee.previousMonth.bonus) : { percentage: 0, hasChange: false };
          const commissionChange = employee.previousMonth ? getFieldPercentageChange(employee.commission, employee.previousMonth.commission) : { percentage: 0, hasChange: false };
          const overtimeChange = employee.previousMonth ? getFieldPercentageChange(employee.overtime, employee.previousMonth.overtime) : { percentage: 0, hasChange: false };
          const gifFlexChange = employee.previousMonth ? getFieldPercentageChange(employee.gifFlex, employee.previousMonth.gifFlex) : { percentage: 0, hasChange: false };
          const onCallChange = employee.previousMonth ? getFieldPercentageChange(employee.onCall, employee.previousMonth.onCall) : { percentage: 0, hasChange: false };
          
          return (
            <NotionTableRow 
              key={employee.id} 
              className={`hover:bg-gray-50/80 transition-colors ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}
            >
              <NotionTableCell align="center" sticky className="py-2">
                <Checkbox
                  checked={approvedEmployees.has(employee.id)}
                  onCheckedChange={() => onApproveEmployee(employee.id)}
                  aria-label={`Approve payroll for ${employee.name}`}
                  className="h-4 w-4"
                />
              </NotionTableCell>
              <NotionTableCell sticky className="py-2">
                <div className="flex items-center gap-2">
                  <EmployeeAvatar 
                    name={employee.name}
                    initials={employee.initials}
                    size="sm"
                  />
                  <span className="font-medium text-sm truncate">{employee.name}</span>
                  {approvedEmployees.has(employee.id) && (
                    <Check className="h-4 w-4 text-green-600 ml-1" />
                  )}
                </div>
              </NotionTableCell>
              <NotionTableCell sticky className="py-2">
                <span className="text-sm text-muted-foreground">{employee.department}</span>
              </NotionTableCell>
              <NotionTableCell align="right" className={`py-2 ${displayedGrossPayChange.percentage !== 0 ? getGrossPayDifferenceClasses(displayedGrossPayChange.percentage).cellClass : ''}`}>
                {displayedGrossPayChange.percentage !== 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <span className={`text-sm cursor-help ${getGrossPayDifferenceClasses(displayedGrossPayChange.percentage).textClass}`}>
                           {displayedGrossPayChange.percentage > 0 ? '+' : ''}{displayedGrossPayChange.percentage.toFixed(1)}%
                         </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white border-gray-800 shadow-lg px-3 py-2 text-xs rounded-lg">
                        <p>{payDifferenceTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="text-muted-foreground text-sm">0%</span>
                )}
              </NotionTableCell>
              <NotionTableCell align="right" className="font-medium py-2">
                <EditableCell
                  value={employee.basePay}
                  onSave={(newValue) => onEmployeeUpdate(employee.id, 'basePay', newValue)}
                  field="basePay"
                  employeeName={employee.name}
                  className="font-medium"
                />
              </NotionTableCell>
              <NotionTableCell align="right" className={`py-2 ${getChangeBackgroundClass(bonusChange.percentage, bonusChange.hasChange)}`}>
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
              <NotionTableCell align="right" className={`py-2 ${getChangeBackgroundClass(commissionChange.percentage, commissionChange.hasChange)}`}>
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
              <NotionTableCell align="right" className={`py-2 ${getChangeBackgroundClass(overtimeChange.percentage, overtimeChange.hasChange)}`}>
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
              <NotionTableCell align="right" className={`py-2 ${getChangeBackgroundClass(gifFlexChange.percentage, gifFlexChange.hasChange)}`}>
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
              <NotionTableCell align="right" className={`py-2 ${getChangeBackgroundClass(onCallChange.percentage, onCallChange.hasChange)}`}>
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
              <NotionTableCell align="right" className="font-medium py-2">
                {formatCurrency(employee.totalIncome)}
              </NotionTableCell>
            </NotionTableRow>
          );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
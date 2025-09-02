import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check } from 'lucide-react';
import { NotionTable, NotionTableHeader, NotionTableBody, NotionTableRow, NotionTableHead, NotionTableCell } from '@/components/NotionTable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/formatters';

interface EmployerCostTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  viewMode: 'compact' | 'detailed' | 'simple';
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
}

export const EmployerCostTable = ({ employees, summary, viewMode, approvedEmployees, onApproveEmployee }: EmployerCostTableProps) => {
  // Sort employees by employer cost differences (largest differences first)
  const sortedEmployees = [...employees].sort((a, b) => {
    const aEmployerCostChange = a.previousMonth 
      ? Math.abs(((a.employerCost - a.previousMonth.employerCost) / a.previousMonth.employerCost) * 100)
      : 0;
    const bEmployerCostChange = b.previousMonth 
      ? Math.abs(((b.employerCost - b.previousMonth.employerCost) / b.previousMonth.employerCost) * 100)
      : 0;
    return bEmployerCostChange - aEmployerCostChange;
  });

  // Traffic light color logic: smaller value = red, larger value = green
  const getPercentageColorClass = (percentage: number) => {
    if (percentage > 0) {
      // Increase (larger value) = green
      return 'text-green-700 bg-green-50 border border-green-200';
    } else if (percentage < 0) {
      // Decrease (smaller value) = red
      return 'text-red-700 bg-red-50 border border-red-200';
    } else {
      // No change
      return 'text-gray-700 bg-gray-50 border border-gray-200';
    }
  };

  // Get tooltip information about employer cost differences
  const getEmployerCostDifferenceTooltip = (employee: Employee) => {
    if (!employee.previousMonth) return 'No previous data available';
    
    const changes = [];
    
    // Check for changes in different employer cost components
    const employerNIDiff = employee.employerNI - employee.previousMonth.employerNI;
    if (Math.abs(employerNIDiff) > 0) {
      changes.push(`Employer NI: ${employerNIDiff > 0 ? '+' : ''}${formatCurrency(employerNIDiff)}`);
    }
    
    const employerPensionDiff = employee.employerPension - employee.previousMonth.employerPension;
    if (Math.abs(employerPensionDiff) > 0) {
      changes.push(`Employer Pension: ${employerPensionDiff > 0 ? '+' : ''}${formatCurrency(employerPensionDiff)}`);
    }
    
    return changes.length > 0 ? changes.join(', ') : 'No changes in employer cost components';
  };
  
  // Calculate summary totals for employer cost breakdown
  const totalEmployerNI = employees.reduce((sum, emp) => sum + emp.employerNI, 0);
  const totalEmployerPension = employees.reduce((sum, emp) => sum + emp.employerPension, 0);

  return (
    <NotionTable>
      <NotionTableHeader>
        <NotionTableRow>
          <NotionTableHead width="40px" align="center" sticky>
            <span className="text-xs font-bold uppercase tracking-wide">APPROVE</span>
          </NotionTableHead>
          <NotionTableHead width="160px" sticky>
            <span className="text-xs font-bold uppercase tracking-wide">EMPLOYEE</span>
          </NotionTableHead>
          <NotionTableHead width="120px" sticky>
            <span className="text-xs font-bold uppercase tracking-wide">DEPARTMENT</span>
          </NotionTableHead>
          <NotionTableHead width="120px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">EMPLOYER COST DIFF %</span>
          </NotionTableHead>
          <NotionTableHead width="128px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">GROSS PAY</span>
          </NotionTableHead>
          <NotionTableHead width="160px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">NATIONAL INSURANCE</span>
          </NotionTableHead>
          <NotionTableHead width="112px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">PENSION</span>
          </NotionTableHead>
          <NotionTableHead width="160px" align="right">
            <span className="text-xs font-bold uppercase tracking-wide">TOTAL EMPLOYER COST</span>
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
            {formatCurrency(summary.totalIncome)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(totalEmployerNI)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(totalEmployerPension)}
          </NotionTableCell>
          <NotionTableCell align="right" className="text-muted-foreground">
            {formatCurrency(summary.totalEmployerCost)}
          </NotionTableCell>
        </NotionTableRow>
          
        {/* Employee rows */}
        {sortedEmployees.map((employee, index) => {
          // Calculate total employer cost change percentage
          const currentEmployerCost = employee.employerCost;
          const previousEmployerCost = employee.previousMonth?.employerCost || currentEmployerCost;
          const employerCostChangePercentage = previousEmployerCost > 0 
            ? ((currentEmployerCost - previousEmployerCost) / previousEmployerCost) * 100 
            : 0;
          
          // Show detailed differences for only first 7 employees with differences
          const shouldShowDifference = index < 7 && Math.abs(employerCostChangePercentage) > 0.1;
          const displayedEmployerCostChange = shouldShowDifference ? employerCostChangePercentage : 0;
          
          const employerCostDifferenceTooltip = getEmployerCostDifferenceTooltip(employee);
          
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
            <NotionTableCell align="right" className="py-2">
              {displayedEmployerCostChange !== 0 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`text-sm font-medium cursor-help px-2 py-1 rounded-md ${getPercentageColorClass(displayedEmployerCostChange)}`}>
                        {displayedEmployerCostChange > 0 ? '+' : ''}{displayedEmployerCostChange.toFixed(1)}%
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-800 shadow-lg px-3 py-2 text-xs rounded-lg">
                      <p>{employerCostDifferenceTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-muted-foreground text-sm">0%</span>
              )}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.totalIncome)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.employerNI)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.employerPension)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium py-2">
              {formatCurrency(employee.employerCost)}
            </NotionTableCell>
          </NotionTableRow>
        );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
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
  const filteredEmployees = employees;
  
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
          <NotionTableHead width="192px" sticky>Employee</NotionTableHead>
          <NotionTableHead width="80px" align="center">Action</NotionTableHead>
          <NotionTableHead width="120px" align="right">Employer Cost Difference %</NotionTableHead>
          <NotionTableHead width="128px" align="right">Gross Pay</NotionTableHead>
          <NotionTableHead width="160px" align="right">National Insurance</NotionTableHead>
          <NotionTableHead width="112px" align="right">Pension</NotionTableHead>
          <NotionTableHead width="160px" align="right">Total Employer Cost</NotionTableHead>
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
          <NotionTableCell align="right">
            <span className="text-green-700 bg-green-50 border border-green-200 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium">+2.3%</span>
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(summary.totalIncome)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalEmployerNI)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(totalEmployerPension)}
          </NotionTableCell>
          <NotionTableCell align="right" className="font-semibold">
            {formatCurrency(summary.totalEmployerCost)}
          </NotionTableCell>
        </NotionTableRow>
          
        {/* Employee rows */}
        {filteredEmployees.map((employee) => {
          // Calculate total employer cost change percentage
          const currentEmployerCost = employee.employerCost;
          const previousEmployerCost = employee.previousMonth?.employerCost || currentEmployerCost;
          const employerCostChangePercentage = previousEmployerCost > 0 
            ? ((currentEmployerCost - previousEmployerCost) / previousEmployerCost) * 100 
            : 0;
          
          const employerCostDifferenceTooltip = getEmployerCostDifferenceTooltip(employee);
          
          return (
          <NotionTableRow key={employee.id}>
            <NotionTableCell sticky>
              <div className="flex items-center gap-2">
                <EmployeeAvatar 
                  name={employee.name}
                  initials={employee.initials}
                  size="sm"
                />
                <span className="font-medium text-sm">{employee.name}</span>
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
            <NotionTableCell align="right">
              {employerCostChangePercentage !== 0 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium cursor-help ${getPercentageColorClass(employerCostChangePercentage)}`}>
                        {employerCostChangePercentage > 0 ? '+' : ''}{employerCostChangePercentage.toFixed(1)}%
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{employerCostDifferenceTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.totalIncome)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.employerNI)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.employerPension)}
            </NotionTableCell>
            <NotionTableCell align="right" className="font-medium">
              {formatCurrency(employee.employerCost)}
            </NotionTableCell>
          </NotionTableRow>
        );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
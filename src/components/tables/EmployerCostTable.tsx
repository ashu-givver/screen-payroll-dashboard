import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { NotionTable, NotionTableHeader, NotionTableBody, NotionTableRow, NotionTableHead, NotionTableCell } from '@/components/NotionTable';
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
  
  // Calculate summary totals for employer cost breakdown
  const totalEmployerNI = employees.reduce((sum, emp) => sum + emp.employerNI, 0);
  const totalEmployerPension = employees.reduce((sum, emp) => sum + emp.employerPension, 0);

  return (
    <NotionTable>
      <NotionTableHeader>
        <NotionTableRow>
          <NotionTableHead width="192px" sticky>Employee</NotionTableHead>
          <NotionTableHead width="128px" align="right">Gross Pay</NotionTableHead>
          <NotionTableHead width="160px" align="right">National Insurance</NotionTableHead>
          <NotionTableHead width="112px" align="right">Pension</NotionTableHead>
          <NotionTableHead width="160px" align="right">Total Employer Cost</NotionTableHead>
          <NotionTableHead width="160px" align="right">Total Employer Costs Change</NotionTableHead>
        </NotionTableRow>
      </NotionTableHeader>
      <NotionTableBody>
        {/* Total row */}
        <NotionTableRow className="bg-muted/40 font-medium">
          <NotionTableCell className="font-semibold" sticky>Total</NotionTableCell>
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
          <NotionTableCell align="right" className="font-semibold text-green-600">
            +2.3%
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
            <NotionTableCell align="right">
              {employerCostChangePercentage !== 0 && (
                <span className={`font-medium ${employerCostChangePercentage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {employerCostChangePercentage > 0 ? '+' : ''}{employerCostChangePercentage.toFixed(1)}%
                </span>
              )}
            </NotionTableCell>
          </NotionTableRow>
        );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
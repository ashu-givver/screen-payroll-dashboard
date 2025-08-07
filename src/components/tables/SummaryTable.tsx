import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface SummaryTableProps {
  employees: Employee[];
  summary: PayrollSummary;
}

export const SummaryTable = ({ employees, summary }: SummaryTableProps) => {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-left font-medium text-muted-foreground">Employee</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Income</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Deductions</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Take home pay</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Employer cost</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Status ↑</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="border-b border-border bg-muted/30">
            <TableCell className="font-semibold text-payroll-total">Total</TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
            <TableCell className="text-right font-semibold">
              <span className="text-payroll-positive">
                {formatCurrency(summary.totalDeductions)} +144.08
              </span>
            </TableCell>
            <TableCell className="text-right font-semibold">
              <span className="text-payroll-negative">
                {formatCurrency(summary.totalTakeHomePay)} -144.08
              </span>
            </TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(summary.totalEmployerCost)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          
          {/* Employee rows */}
          {employees.map((employee) => (
            <TableRow key={employee.id} className="border-b border-border hover:bg-muted/20">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar 
                    name={employee.name}
                    initials={employee.initials}
                    size="sm"
                  />
                  <span className="font-medium">{employee.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.totalIncome)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{formatCurrency(employee.deductions)}</span>
                  <span className="text-xs text-muted-foreground">-0.20</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">{formatCurrency(employee.takeHomePay)}</span>
                  <span className="text-xs text-payroll-positive">+0.20</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.employerCost)}
              </TableCell>
              <TableCell className="text-right">
                <Badge 
                  variant="outline" 
                  className="bg-success/10 text-success border-success/20"
                >
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  {employee.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="px-6 py-4 text-sm text-muted-foreground">
        1 - {employees.length} of {employees.length} records
      </div>
    </div>
  );
};
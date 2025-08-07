import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface IncomeTableProps {
  employees: Employee[];
  summary: PayrollSummary;
}

export const IncomeTable = ({ employees, summary }: IncomeTableProps) => {
  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-left font-medium text-muted-foreground">Employee</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Base Pay</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Salary basis</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Units</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Rate</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Total income</TableHead>
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
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(summary.totalIncome)}
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
                {formatCurrency(employee.basePay)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {employee.salaryBasis}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {employee.units}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.rate)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.totalIncome)}
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
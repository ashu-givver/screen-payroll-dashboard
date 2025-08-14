import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface EmployerCostTableProps {
  employees: Employee[];
  summary: PayrollSummary;
}

export const EmployerCostTable = ({ employees, summary }: EmployerCostTableProps) => {
  // Calculate summary totals for employer cost breakdown
  const totalEmployerNI = employees.reduce((sum, emp) => sum + emp.employerNI, 0);
  const totalEmployerPension = employees.reduce((sum, emp) => sum + emp.employerPension, 0);

  return (
    <div className="bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-left font-medium text-muted-foreground">Gross Pay</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">National Insurance</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Pension</TableHead>
            <TableHead className="text-right font-medium text-muted-foreground">Total employer cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="border-b border-border bg-muted/30">
            <TableCell className="font-semibold text-payroll-total">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(totalEmployerNI)}
            </TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(totalEmployerPension)}
            </TableCell>
            <TableCell className="text-right font-semibold text-payroll-total">
              {formatCurrency(summary.totalEmployerCost)}
            </TableCell>
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
                  <div>
                    <div className="font-medium">{formatCurrency(employee.totalIncome)}</div>
                    <div className="text-sm text-muted-foreground">{employee.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.employerNI)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.employerPension)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.employerCost)}
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
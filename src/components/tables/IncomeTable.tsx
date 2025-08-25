import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface IncomeTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  viewMode: 'compact' | 'detailed';
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
}

export const IncomeTable = ({ employees, summary, viewMode, approvedEmployees, onApproveEmployee }: IncomeTableProps) => {
  const filteredEmployees = employees;

  return (
    <div className="space-y-0">
      <Table>
        <TableHeader>
          <TableRow className="h-9">
            <TableHead className="w-48" sticky>Employee</TableHead>
            <TableHead className="text-right w-28">Base Pay</TableHead>
            <TableHead className="text-right w-24">Bonus</TableHead>
            <TableHead className="text-right w-32">Commission</TableHead>
            <TableHead className="text-right w-28">Overtime</TableHead>
            <TableHead className="text-right w-28">GIF Flex</TableHead>
            <TableHead className="text-right w-32">Gross Pay</TableHead>
            <TableHead className="w-32">
              <div className="flex flex-col">
                <span className="text-xs font-medium">Approval</span>
                <span className="text-xs text-muted-foreground font-normal">Approve each employee for this payroll</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Total row */}
          <TableRow className="bg-gray-50/60 font-medium h-9">
            <TableCell className="font-semibold text-gray-900" sticky>Total</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
            <TableCell className="text-right font-semibold text-gray-900">£0.00</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">£0.00</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">£0.00</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">£0.00</TableCell>
            <TableCell className="text-right font-semibold text-gray-900">
              {formatCurrency(summary.totalIncome)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          
          {/* Employee rows */}
          {filteredEmployees.map((employee) => (
            <TableRow key={employee.id} className="h-9">
              <TableCell sticky>
                <div className="flex items-center gap-2">
                  <EmployeeAvatar 
                    name={employee.name}
                    initials={employee.initials}
                    size="sm"
                  />
                  <span className="font-medium text-gray-900 text-sm">{employee.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.basePay)}
              </TableCell>
              <TableCell className="text-right text-gray-600">£0.00</TableCell>
              <TableCell className="text-right text-gray-600">£0.00</TableCell>
              <TableCell className="text-right text-gray-600">£0.00</TableCell>
              <TableCell className="text-right text-gray-600">£0.00</TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(employee.totalIncome)}
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
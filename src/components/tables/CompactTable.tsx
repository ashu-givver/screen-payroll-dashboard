import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface CompactTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
}

export const CompactTable = ({ employees, summary, approvedEmployees, onApproveEmployee }: CompactTableProps) => {
  const filteredEmployees = employees;

  // Calculate comparison with previous month
  const getGrossPayChange = (employee: Employee) => {
    if (!employee.previousMonth) return { amount: 0, percentage: 0 };
    const change = employee.totalIncome - employee.previousMonth.totalIncome;
    const percentage = employee.previousMonth.totalIncome > 0 
      ? (change / employee.previousMonth.totalIncome) * 100 
      : 0;
    return { amount: change, percentage };
  };

  // Calculate summary totals for all pay elements
  const totalBasePay = employees.reduce((sum, emp) => sum + emp.basePay, 0);
  const totalBonus = employees.reduce((sum, emp) => sum + emp.bonus, 0);
  const totalCommission = employees.reduce((sum, emp) => sum + emp.commission, 0);
  const totalOvertime = employees.reduce((sum, emp) => sum + emp.overtime, 0);
  const totalGifFlex = employees.reduce((sum, emp) => sum + emp.gifFlex, 0);
  const totalOnCall = employees.reduce((sum, emp) => sum + emp.onCall, 0);

  return (
    <div className="space-y-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow className="h-8 border-b">
              <TableHead className="w-40 text-xs font-medium text-gray-600 px-2">Employee</TableHead>
              <TableHead className="text-right w-24 text-xs font-medium text-gray-600 px-1">Base Pay</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">Bonus</TableHead>
              <TableHead className="text-right w-24 text-xs font-medium text-gray-600 px-1">Commission</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">Overtime</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">GIF Flex</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">OnCall</TableHead>
              <TableHead className="text-right w-28 text-xs font-medium text-gray-600 px-1">Gross Pay</TableHead>
              <TableHead className="text-right w-24 text-xs font-medium text-gray-600 px-1">vs Last Month</TableHead>
              <TableHead className="w-20 text-xs font-medium text-gray-600 px-1">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Total row */}
            <TableRow className="bg-gray-50/60 font-medium h-8 border-b border-gray-200">
              <TableCell className="font-semibold text-gray-900 text-xs px-2">Total</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">
                {formatCurrency(totalBasePay)}
              </TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">
                {formatCurrency(totalBonus)}
              </TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">
                {formatCurrency(totalCommission)}
              </TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">
                {formatCurrency(totalOvertime)}
              </TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">
                {formatCurrency(totalGifFlex)}
              </TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">
                {formatCurrency(totalOnCall)}
              </TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">
                {formatCurrency(summary.totalIncome)}
              </TableCell>
              <TableCell className="text-right text-xs px-1">
                <span className="text-green-600 font-medium">+2.3%</span>
              </TableCell>
              <TableCell className="px-1"></TableCell>
            </TableRow>
            
            {/* Employee rows */}
            {filteredEmployees.map((employee) => {
              const grossPayChange = getGrossPayChange(employee);
              return (
                <TableRow key={employee.id} className="h-8 border-b border-gray-100 hover:bg-gray-50/30">
                  <TableCell className="px-2">
                    <div className="flex items-center gap-2">
                      <EmployeeAvatar 
                        name={employee.name}
                        initials={employee.initials}
                        size="sm"
                      />
                      <span className="font-medium text-gray-900 text-xs truncate">{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900 text-xs px-1">
                    {formatCurrency(employee.basePay)}
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1">
                    {employee.bonus > 0 ? formatCurrency(employee.bonus) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1">
                    {employee.commission > 0 ? formatCurrency(employee.commission) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1">
                    {employee.overtime > 0 ? formatCurrency(employee.overtime) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1">
                    {employee.gifFlex > 0 ? formatCurrency(employee.gifFlex) : '-'}
                  </TableCell>
                  <TableCell className="text-right text-gray-900 text-xs px-1">
                    {employee.onCall > 0 ? formatCurrency(employee.onCall) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900 text-xs px-1">
                    {formatCurrency(employee.totalIncome)}
                  </TableCell>
                  <TableCell className="text-right text-xs px-1">
                    {grossPayChange.amount !== 0 && (
                      <div className="flex flex-col">
                        <span className={`${grossPayChange.amount > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                          {grossPayChange.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(grossPayChange.amount))}
                        </span>
                        <span className={`${grossPayChange.percentage > 0 ? 'text-green-600' : 'text-red-600'} text-xs`}>
                          {grossPayChange.percentage > 0 ? '+' : ''}{grossPayChange.percentage.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-1">
                    <Button
                      size="sm"
                      variant={approvedEmployees.has(employee.id) ? "secondary" : "outline"}
                      onClick={() => onApproveEmployee(employee.id)}
                      disabled={approvedEmployees.has(employee.id)}
                      className="h-5 px-2 text-xs"
                    >
                      {approvedEmployees.has(employee.id) ? "✓" : "Approve"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
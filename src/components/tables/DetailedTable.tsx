import { Employee, PayrollSummary } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

interface DetailedTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
}

export const DetailedTable = ({ employees, summary, approvedEmployees, onApproveEmployee }: DetailedTableProps) => {
  const filteredEmployees = employees;

  // Calculate comparison with previous month for any element
  const getElementChange = (current: number, previous: number) => {
    if (previous === 0) return { amount: 0, percentage: 0 };
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { amount: change, percentage };
  };

  // Calculate summary totals for all elements
  const totalBasePay = employees.reduce((sum, emp) => sum + emp.basePay, 0);
  const totalBonus = employees.reduce((sum, emp) => sum + emp.bonus, 0);
  const totalCommission = employees.reduce((sum, emp) => sum + emp.commission, 0);
  const totalOvertime = employees.reduce((sum, emp) => sum + emp.overtime, 0);
  const totalGifFlex = employees.reduce((sum, emp) => sum + emp.gifFlex, 0);
  const totalOnCall = employees.reduce((sum, emp) => sum + emp.onCall, 0);
  const totalPaye = employees.reduce((sum, emp) => sum + emp.paye, 0);
  const totalNI = employees.reduce((sum, emp) => sum + emp.ni, 0);
  const totalPension = employees.reduce((sum, emp) => sum + emp.pension, 0);
  const totalStudentLoan = employees.reduce((sum, emp) => sum + emp.studentLoan, 0);
  const totalPostgradLoan = employees.reduce((sum, emp) => sum + emp.postgradLoan, 0);
  const totalEmployerNI = employees.reduce((sum, emp) => sum + emp.employerNI, 0);
  const totalEmployerPension = employees.reduce((sum, emp) => sum + emp.employerPension, 0);

  return (
    <div className="space-y-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow className="h-8 border-b">
              <TableHead className="w-32 text-xs font-medium text-gray-600 px-2">Employee</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">Base Pay</TableHead>
              <TableHead className="text-right w-18 text-xs font-medium text-gray-600 px-1">Bonus</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">Commission</TableHead>
              <TableHead className="text-right w-18 text-xs font-medium text-gray-600 px-1">Overtime</TableHead>
              <TableHead className="text-right w-18 text-xs font-medium text-gray-600 px-1">GIF Flex</TableHead>
              <TableHead className="text-right w-16 text-xs font-medium text-gray-600 px-1">OnCall</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">Gross Pay</TableHead>
              <TableHead className="text-right w-16 text-xs font-medium text-gray-600 px-1">PAYE</TableHead>
              <TableHead className="text-right w-14 text-xs font-medium text-gray-600 px-1">NI</TableHead>
              <TableHead className="text-right w-18 text-xs font-medium text-gray-600 px-1">Pension</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">Student Loan</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">Postgrad Loan</TableHead>
              <TableHead className="text-right w-18 text-xs font-medium text-gray-600 px-1">Emp NI</TableHead>
              <TableHead className="text-right w-20 text-xs font-medium text-gray-600 px-1">Emp Pension</TableHead>
              <TableHead className="w-16 text-xs font-medium text-gray-600 px-1">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Total row */}
            <TableRow className="bg-gray-50/60 font-medium h-8 border-b border-gray-200">
              <TableCell className="font-semibold text-gray-900 text-xs px-2">Total</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalBasePay)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalBonus)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalCommission)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalOvertime)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalGifFlex)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalOnCall)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(summary.totalIncome)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalPaye)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalNI)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalPension)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalStudentLoan)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalPostgradLoan)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalEmployerNI)}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 text-xs px-1">{formatCurrency(totalEmployerPension)}</TableCell>
              <TableCell className="px-1"></TableCell>
            </TableRow>
            
            {/* Employee rows */}
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id} className="h-8 border-b border-gray-100 hover:bg-gray-50/30">
                <TableCell className="px-2">
                  <div className="flex items-center gap-1">
                    <EmployeeAvatar 
                      name={employee.name}
                      initials={employee.initials}
                      size="sm"
                    />
                    <span className="font-medium text-gray-900 text-xs truncate">{employee.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-gray-900 text-xs px-1">
                  <div className="flex flex-col">
                    <span>{formatCurrency(employee.basePay)}</span>
                    {employee.previousMonth && (
                      <span className="text-xs text-gray-500">
                        {getElementChange(employee.basePay, employee.previousMonth.basePay).amount !== 0 && (
                          <>
                            {getElementChange(employee.basePay, employee.previousMonth.basePay).amount > 0 ? '+' : ''}
                            {getElementChange(employee.basePay, employee.previousMonth.basePay).percentage.toFixed(1)}%
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right text-gray-900 text-xs px-1">
                  <div className="flex flex-col">
                    <span>{employee.bonus > 0 ? formatCurrency(employee.bonus) : '-'}</span>
                    {employee.previousMonth && employee.bonus !== employee.previousMonth.bonus && (
                      <span className={`text-xs ${employee.bonus > employee.previousMonth.bonus ? 'text-green-600' : 'text-red-600'}`}>
                        {employee.bonus > employee.previousMonth.bonus ? '+' : ''}{formatCurrency(Math.abs(employee.bonus - employee.previousMonth.bonus))}
                      </span>
                    )}
                  </div>
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
                  <div className="flex flex-col">
                    <span>{employee.onCall > 0 ? formatCurrency(employee.onCall) : '-'}</span>
                    {employee.previousMonth && employee.onCall !== employee.previousMonth.onCall && (
                      <span className={`text-xs ${employee.onCall > employee.previousMonth.onCall ? 'text-green-600' : 'text-red-600'}`}>
                        {employee.onCall > employee.previousMonth.onCall ? '+' : ''}{formatCurrency(Math.abs(employee.onCall - employee.previousMonth.onCall))}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-gray-900 text-xs px-1">
                  <div className="flex flex-col">
                    <span>{formatCurrency(employee.totalIncome)}</span>
                    {employee.previousMonth && (
                      <span className={`text-xs ${employee.totalIncome > employee.previousMonth.totalIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {employee.totalIncome > employee.previousMonth.totalIncome ? '+' : ''}{formatCurrency(Math.abs(employee.totalIncome - employee.previousMonth.totalIncome))}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right text-gray-900 text-xs px-1">{formatCurrency(employee.paye)}</TableCell>
                <TableCell className="text-right text-gray-900 text-xs px-1">{formatCurrency(employee.ni)}</TableCell>
                <TableCell className="text-right text-gray-900 text-xs px-1">{formatCurrency(employee.pension)}</TableCell>
                <TableCell className="text-right text-gray-900 text-xs px-1">{formatCurrency(employee.studentLoan)}</TableCell>
                <TableCell className="text-right text-gray-900 text-xs px-1">{formatCurrency(employee.postgradLoan)}</TableCell>
                <TableCell className="text-right text-gray-900 text-xs px-1">{formatCurrency(employee.employerNI)}</TableCell>
                <TableCell className="text-right text-gray-900 text-xs px-1">{formatCurrency(employee.employerPension)}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
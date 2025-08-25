import { Employee, PayrollSummary, CustomView } from '@/types/payroll';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CustomViewTableProps {
  employees: Employee[];
  summary: PayrollSummary;
  approvedEmployees: Set<string>;
  onApproveEmployee: (employeeId: string) => void;
  viewMode: 'compact' | 'detailed';
  customView: CustomView;
}

const getFieldLabel = (fieldId: string): string => {
  const labels: Record<string, string> = {
    basePay: 'Base Pay',
    bonus: 'Bonus',
    commission: 'Commission',
    overtime: 'Overtime',
    gifFlex: 'GIF Flex',
    onCall: 'On Call',
    totalIncome: 'Gross Pay',
    incomeTax: 'Income Tax',
    nationalInsurance: 'National Insurance',
    pension: 'Pension (Employee)',
    studentLoan: 'Student Loan',
    deductions: 'Total Deductions',
    employerNI: 'Employer NI',
    employerPension: 'Employer Pension',
    takeHomePay: 'Net Pay',
  };
  return labels[fieldId] || fieldId;
};

const getFieldValue = (employee: Employee, fieldId: string): number => {
  switch (fieldId) {
    case 'employerNI':
      return employee.totalIncome * 0.138; // 13.8% employer NI
    case 'employerPension':
      return employee.totalIncome * 0.03; // 3% employer pension contribution
    default:
      return (employee as any)[fieldId] || 0;
  }
};

export const CustomViewTable = ({
  employees,
  approvedEmployees,
  onApproveEmployee,
  viewMode,
  customView
}: CustomViewTableProps) => {
  const getApprovalStatus = (employeeId: string) => {
    if (approvedEmployees.has(employeeId)) {
      return 'approved';
    }
    return 'pending';
  };

  const renderApprovalButton = (employee: Employee) => {
    const status = getApprovalStatus(employee.id);
    
    if (status === 'approved') {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-600" />
        <Button
          size="sm"
          onClick={() => onApproveEmployee(employee.id)}
          className="h-7 px-3 text-xs"
        >
          Approve
        </Button>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Employee</TableHead>
            {customView.fields.map((fieldId) => (
              <TableHead key={fieldId} className="text-right min-w-[120px]">
                {getFieldLabel(fieldId)}
              </TableHead>
            ))}
            <TableHead className="w-[140px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar 
                    name={employee.name}
                    initials={employee.initials}
                    avatar={employee.avatar} 
                    size="sm" 
                  />
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {employee.id} • {employee.department}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              {customView.fields.map((fieldId) => (
                <TableCell key={fieldId} className="text-right font-mono">
                  {formatCurrency(getFieldValue(employee, fieldId))}
                </TableCell>
              ))}
              
              <TableCell className="text-center">
                {renderApprovalButton(employee)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
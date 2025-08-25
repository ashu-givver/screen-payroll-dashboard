import { useState } from 'react';
import { Employee } from '@/types/payroll';
import { NotionTable, NotionTableHeader, NotionTableBody, NotionTableRow, NotionTableHead, NotionTableCell } from '@/components/NotionTable';
import { SortableHeader, SortDirection } from '@/components/SortableHeader';
import { EmployeeAvatar } from '@/components/EmployeeAvatar';
import { EditableCell } from '@/components/EditableCell';
import { formatCurrency } from '@/lib/formatters';
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TotalViewTableProps {
  employees: Employee[];
  onEmployeeUpdate: (employeeId: string, field: string, value: number) => void;
  onApproveEmployee: (employeeId: string) => void;
  approvedEmployees: Set<string>;
  onTagClick?: (tagCategory: string) => void;
}

type SortField = 'name' | 'basePay' | 'totalIncome' | 'takeHomePay' | 'employerCost';

export const TotalViewTable = ({ 
  employees, 
  onEmployeeUpdate, 
  onApproveEmployee,
  approvedEmployees,
  onTagClick
}: TotalViewTableProps) => {
  const [currentSort, setCurrentSort] = useState<{ key: string; direction: SortDirection }>({
    key: 'name',
    direction: 'asc'
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (key: string, direction: SortDirection) => {
    setCurrentSort({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (!currentSort.direction) return 0;
    
    let aValue: string | number;
    let bValue: string | number;

    switch (currentSort.key) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'basePay':
        aValue = a.basePay;
        bValue = b.basePay;
        break;
      case 'totalIncome':
        aValue = a.totalIncome;
        bValue = b.totalIncome;
        break;
      case 'takeHomePay':
        aValue = a.takeHomePay;
        bValue = b.takeHomePay;
        break;
      case 'employerCost':
        aValue = a.employerCost;
        bValue = b.employerCost;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return currentSort.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return currentSort.direction === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const toggleRowExpansion = (employeeId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <NotionTable>
      <NotionTableHeader>
        <NotionTableRow>
          <NotionTableHead className="w-8"> </NotionTableHead>
          <NotionTableHead className="w-32">
            <div className="flex flex-col">
              <span className="text-xs font-medium">Approval</span>
              <span className="text-xs text-muted-foreground font-normal">Approve each employee for this payroll</span>
            </div>
          </NotionTableHead>
          <NotionTableHead className="w-64" sticky>
            <SortableHeader
              sortKey="name"
              currentSort={currentSort}
              onSort={handleSort}
            >
              Employee
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead align="right" className="w-24">
            <SortableHeader
              sortKey="basePay"
              currentSort={currentSort}
              onSort={handleSort}
              align="right"
            >
              Base Pay
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead align="right" className="w-24">Bonus</NotionTableHead>
          <NotionTableHead align="right" className="w-24">Commission</NotionTableHead>
          <NotionTableHead align="right" className="w-24">Overtime</NotionTableHead>
          <NotionTableHead align="right" className="w-24">Gym Flex</NotionTableHead>
          <NotionTableHead align="right" className="w-32">
            <SortableHeader
              sortKey="totalIncome"
              currentSort={currentSort}
              onSort={handleSort}
              align="right"
            >
              Gross Pay
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead align="right" className="w-24">PAYE</NotionTableHead>
          <NotionTableHead align="right" className="w-24">NI</NotionTableHead>
          <NotionTableHead align="right" className="w-24">Pension</NotionTableHead>
          <NotionTableHead align="right" className="w-32">Student Loan</NotionTableHead>
          <NotionTableHead align="right" className="w-32">Postgrad Loan</NotionTableHead>
          <NotionTableHead align="right" className="w-32">Total Deductions</NotionTableHead>
          <NotionTableHead align="right" className="w-24">Employer NI</NotionTableHead>
          <NotionTableHead align="right" className="w-32">Employer Pension</NotionTableHead>
          <NotionTableHead align="right" className="w-32">
            <SortableHeader
              sortKey="employerCost"
              currentSort={currentSort}
              onSort={handleSort}
              align="right"
            >
              Total Employer Cost
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead align="right" className="w-32">
            <SortableHeader
              sortKey="takeHomePay"
              currentSort={currentSort}
              onSort={handleSort}
              align="right"
            >
              Net Pay
            </SortableHeader>
          </NotionTableHead>
          <NotionTableHead className="w-24">Product ID</NotionTableHead>
        </NotionTableRow>
      </NotionTableHeader>
      <NotionTableBody>
        {sortedEmployees.map((employee) => {
          const isExpanded = expandedRows.has(employee.id);
          const isApproved = approvedEmployees.has(employee.id);
          
          return (
            <NotionTableRow 
              key={employee.id}
              className={isApproved ? 'bg-green-50/50' : ''}
            >
              <NotionTableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRowExpansion(employee.id)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </NotionTableCell>
              <NotionTableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onApproveEmployee(employee.id)}
                  disabled={false}
                  className={`h-6 px-3 text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
                    isApproved
                      ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                      : 'bg-transparent text-gray-900 border-gray-400 hover:border-green-600 hover:text-gray-900'
                  }`}
                  aria-label={
                    isApproved 
                      ? `${employee.name} approved for payroll`
                      : `Approve payroll for ${employee.name}`
                  }
                  title={
                    isApproved
                      ? 'Click to unapprove'
                      : 'Mark as approved for payroll'
                  }
                >
                  {isApproved ? "Approved ✓" : "Approve"}
                </Button>
              </NotionTableCell>
              <NotionTableCell sticky>
                <div className="flex items-center gap-3">
                  <EmployeeAvatar 
                    name={employee.name}
                    initials={employee.initials}
                    avatar={employee.avatar}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium text-foreground">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">{employee.department}</div>
                  </div>
                </div>
              </NotionTableCell>
              
              {/* Income Section */}
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.basePay}
                  onSave={(value) => onEmployeeUpdate(employee.id, 'basePay', value)}
                  field="basePay"
                  employeeName={employee.name}
                />
              </NotionTableCell>
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.bonus}
                  onSave={(value) => onEmployeeUpdate(employee.id, 'bonus', value)}
                  field="bonus"
                  employeeName={employee.name}
                />
              </NotionTableCell>
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.commission}
                  onSave={(value) => onEmployeeUpdate(employee.id, 'commission', value)}
                  field="commission"
                  employeeName={employee.name}
                />
              </NotionTableCell>
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.overtime}
                  onSave={(value) => onEmployeeUpdate(employee.id, 'overtime', value)}
                  field="overtime"
                  employeeName={employee.name}
                />
              </NotionTableCell>
              <NotionTableCell align="right">
                <EditableCell
                  value={employee.gifFlex}
                  onSave={(value) => onEmployeeUpdate(employee.id, 'gifFlex', value)}
                  field="gifFlex"
                  employeeName={employee.name}
                />
              </NotionTableCell>
              <NotionTableCell align="right" className="font-medium">
                {formatCurrency(employee.totalIncome)}
              </NotionTableCell>
              
              {/* Deductions Section */}
              <NotionTableCell align="right">
                {formatCurrency(employee.paye)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.ni)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.pension)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.studentLoan)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.postgradLoan)}
              </NotionTableCell>
              <NotionTableCell align="right" className="font-medium">
                {formatCurrency(employee.deductions)}
              </NotionTableCell>
              
              {/* Employer Cost Section */}
              <NotionTableCell align="right">
                {formatCurrency(employee.employerNI)}
              </NotionTableCell>
              <NotionTableCell align="right">
                {formatCurrency(employee.employerPension)}
              </NotionTableCell>
              <NotionTableCell align="right" className="font-medium">
                {formatCurrency(employee.employerCost)}
              </NotionTableCell>
              
              {/* Net Pay */}
              <NotionTableCell align="right" className="font-medium text-green-600">
                {formatCurrency(employee.takeHomePay)}
              </NotionTableCell>
              
              <NotionTableCell>
                <span className="text-xs text-muted-foreground font-mono">
                  {employee.id.padStart(6, '0')}
                </span>
              </NotionTableCell>
            </NotionTableRow>
          );
        })}
      </NotionTableBody>
    </NotionTable>
  );
};
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, MoreHorizontal } from 'lucide-react';
import { PayrollPeriod } from '@/types/payroll';

interface PayrollHeaderProps {
  period: PayrollPeriod;
  onConfirm: () => void;
}

export const PayrollHeader = ({ period, onConfirm }: PayrollHeaderProps) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-payroll-header">
              {period.month} {period.year}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={period.status === 'Draft' ? 'secondary' : 'default'}
                className={period.status === 'Draft' ? 'bg-payroll-draft text-payroll-header' : ''}
              >
                {period.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="bg-payroll-confirm text-white hover:bg-payroll-confirm/90"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-payroll-header">{period.companyName}</span>
          <span className="mx-2">•</span>
          <span>{period.startDate} - {period.endDate}</span>
          <span className="mx-2">•</span>
          <span>{period.employeeCount} employees</span>
        </div>
      </div>
    </div>
  );
};
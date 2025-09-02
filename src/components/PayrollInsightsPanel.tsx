import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { 
  Users, 
  UserPlus, 
  UserMinus,
  CreditCard,
  MinusCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  X,
  PiggyBank
} from 'lucide-react';

interface PayrollInsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PayrollInsightsPanel = ({ isOpen, onClose }: PayrollInsightsPanelProps) => {
  if (!isOpen) return null;

  // Mock data - in real app this would come from props or API
  const headcountData = {
    totalEmployees: 100,
    newJoiners: { current: 5, previous: 3, change: 66.7 },
    leavers: { current: 2, previous: 4, change: -50.0 }
  };

  const paymentsData = [
    { name: 'Bonus', employees: 45, amount: 18750, previousAmount: 16200, change: 15.7 },
    { name: 'Commission', employees: 28, amount: 12400, previousAmount: 11800, change: 5.1 },
    { name: 'Overtime', employees: 32, amount: 8960, previousAmount: 9200, change: -2.6 },
    { name: 'Inflex', employees: 15, amount: 4500, previousAmount: 4200, change: 7.1 },
    { name: 'On Call', employees: 8, amount: 2400, previousAmount: 2600, change: -7.7 }
  ];

  const deductionsData = [
    { name: 'Advance', employees: 12, amount: 3600, previousAmount: 2800, change: 28.6 },
    { name: 'Loan', employees: 8, amount: 2400, previousAmount: 2400, change: 0 },
    { name: 'Cycle to Work', employees: 5, amount: 1250, previousAmount: 1100, change: 13.6 }
  ];

  const pensionsData = [
    { name: 'Opt-out', employees: 15, amount: 0, previousAmount: 0, change: -12.5 },
    { name: 'Newly Eligible', employees: 85, amount: 12750, previousAmount: 0, change: null }
  ];

  const absencesData = [
    { name: 'SSP', employees: 3, amount: 900, previousAmount: 1200, change: -25.0 },
    { name: 'SMP', employees: 2, amount: 2800, previousAmount: 1400, change: 100.0 },
    { name: 'SPP', employees: 1, amount: 700, previousAmount: 0, change: null },
    { name: 'ShPP', employees: 0, amount: 0, previousAmount: 0, change: null },
    { name: 'SAP', employees: 1, amount: 350, previousAmount: 700, change: -50.0 }
  ];

  const renderChangeIndicator = (change: number | null) => {
    if (change === null) {
      return (
        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600">
          New
        </Badge>
      );
    }
    
    if (change === 0) {
      return (
        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 flex items-center gap-1">
          <ArrowRight className="h-3 w-3" />
          0%
        </Badge>
      );
    }

    const Icon = change > 0 ? ArrowUpRight : ArrowDownRight;
    const badgeClass = change > 0 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-700';
    
    return (
      <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${badgeClass} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {Math.abs(change).toFixed(1)}%
      </Badge>
    );
  };

  const renderMetricCard = (title: string, data: any[], icon: React.ComponentType<{ className?: string }>) => {
    const Icon = icon;
    
    return (
      <Card className="rounded-2xl shadow-sm border bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">
              {title}
            </span>
          </div>
          
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="py-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.employees} employees</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {formatCurrency(item.amount)}
                    </div>
                    {renderChangeIndicator(item.change)}
                  </div>
                </div>
                {index < data.length - 1 && <div className="border-b border-gray-100 mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Payroll Insights</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* 1. Headcount Summary - Single Card with 3 Columns */}
          <Card className="rounded-2xl shadow-sm border bg-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Employees */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Total Employees</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {headcountData.totalEmployees}
                  </div>
                  <div className="text-xs text-gray-500">Active this month</div>
                </div>

                {/* New Joiners */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <UserPlus className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">New Joiners</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {headcountData.newJoiners.current}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {renderChangeIndicator(headcountData.newJoiners.change)}
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>

                {/* Leavers */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <UserMinus className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Leavers</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {headcountData.leavers.current}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {renderChangeIndicator(headcountData.leavers.change)}
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Payments, Deductions & Pensions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {renderMetricCard('Payments', paymentsData, CreditCard)}
            {renderMetricCard('Deductions', deductionsData, MinusCircle)}
            {renderMetricCard('Pensions', pensionsData, PiggyBank)}
          </div>

          {/* 3. Absences & Statutory Pay */}
          {renderMetricCard('Absences & Statutory Pay', absencesData, Calendar)}
        </div>
      </div>
    </div>
  );
};
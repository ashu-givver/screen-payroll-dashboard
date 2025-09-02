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
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  X
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

  const absencesData = [
    { name: 'SSP', employees: 3, amount: 900, previousAmount: 1200, change: -25.0 },
    { name: 'SMP', employees: 2, amount: 2800, previousAmount: 1400, change: 100.0 },
    { name: 'SPP', employees: 1, amount: 700, previousAmount: 0, change: null },
    { name: 'ShPP', employees: 0, amount: 0, previousAmount: 0, change: null },
    { name: 'SAP', employees: 1, amount: 350, previousAmount: 700, change: -50.0 }
  ];

  const renderChangeIndicator = (change: number | null, size: 'small' | 'large' = 'small') => {
    if (change === null) {
      return (
        <Badge variant="secondary" className="text-gray-500 bg-gray-100">
          New
        </Badge>
      );
    }
    
    if (change === 0) {
      return (
        <Badge variant="secondary" className="text-gray-500 bg-gray-100">
          <Minus className="h-3 w-3 mr-1" />
          0%
        </Badge>
      );
    }

    const Icon = change > 0 ? ArrowUp : ArrowDown;
    const isPositive = change > 0;
    const colorClass = isPositive 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
    
    const textSize = size === 'large' ? 'text-sm' : 'text-xs';
    
    return (
      <Badge variant="secondary" className={`${colorClass} ${textSize}`}>
        <Icon className="h-3 w-3 mr-1" />
        {Math.abs(change).toFixed(1)}%
      </Badge>
    );
  };

  const renderMetricRow = (item: any, index: number) => (
    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-gray-600">{item.name}</span>
          <Badge variant="outline" className="text-xs">
            {item.employees} emp
          </Badge>
        </div>
        <div className="text-lg font-semibold text-gray-900">{formatCurrency(item.amount)}</div>
      </div>
      <div className="text-right">
        {renderChangeIndicator(item.change)}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold">Payroll Insights</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* 1. Headcount Summary (Top Banner) */}
          <Card className="rounded-2xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Headcount Summary</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{headcountData.totalEmployees}</div>
                  <div className="text-sm text-gray-500 mb-2">Total Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{headcountData.newJoiners.current}</div>
                  <div className="text-sm text-gray-500 mb-2">New Joiners</div>
                  {renderChangeIndicator(headcountData.newJoiners.change)}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{headcountData.leavers.current}</div>
                  <div className="text-sm text-gray-500 mb-2">Leavers</div>
                  {renderChangeIndicator(headcountData.leavers.change)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Payments & Deductions (Side-by-side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payments */}
            <Card className="rounded-2xl shadow-sm border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
                </div>
                <div className="space-y-1">
                  {paymentsData.map(renderMetricRow)}
                </div>
              </CardContent>
            </Card>
            
            {/* Deductions */}
            <Card className="rounded-2xl shadow-sm border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MinusCircle className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Deductions</h3>
                </div>
                <div className="space-y-1">
                  {deductionsData.map(renderMetricRow)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. Absences & Statutory Pay (Full Width) */}
          <Card className="rounded-2xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Absences & Statutory Pay</h3>
              </div>
              <div className="space-y-1">
                {absencesData.map(renderMetricRow)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
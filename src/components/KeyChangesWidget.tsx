import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Wallet, Building, Shield } from 'lucide-react';
import { BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Cell, LabelList } from 'recharts';
import { employees } from '@/data/employees';
import { formatCurrency } from '@/lib/formatters';

export const KeyChangesWidget = () => {
  // Calculate breakdown totals for current month
  const currentNetPay = employees.reduce((sum, emp) => sum + emp.takeHomePay, 0);
  const currentHMRC = employees.reduce((sum, emp) => sum + emp.paye + emp.ni + emp.employerNI, 0);
  const currentPension = employees.reduce((sum, emp) => sum + emp.pension + emp.employerPension, 0);

  // Calculate breakdown totals for previous month
  const previousNetPay = employees.reduce((sum, emp) => {
    if (!emp.previousMonth) return sum;
    return sum + emp.previousMonth.takeHomePay;
  }, 0);
  const previousHMRC = employees.reduce((sum, emp) => {
    if (!emp.previousMonth) return sum;
    return sum + emp.previousMonth.paye + emp.previousMonth.ni + emp.previousMonth.employerNI;
  }, 0);
  const previousPension = employees.reduce((sum, emp) => {
    if (!emp.previousMonth) return sum;
    return sum + emp.previousMonth.pension + emp.previousMonth.employerPension;
  }, 0);

  // Calculate percentage changes
  const netPayChange = previousNetPay > 0 ? ((currentNetPay - previousNetPay) / previousNetPay) * 100 : 0;
  const hmrcChange = previousHMRC > 0 ? ((currentHMRC - previousHMRC) / previousHMRC) * 100 : 0;
  const pensionChange = previousPension > 0 ? ((currentPension - previousPension) / previousPension) * 100 : 0;

  // Calculate employees with significant Gross Pay changes (±5%)
  const significantChanges = employees
    .map(emp => {
      if (!emp.previousMonth) return null;
      
      const currentGrossPay = emp.totalIncome;
      const previousGrossPay = emp.previousMonth.totalIncome;
      
      if (previousGrossPay === 0) return null;
      
      const percentageChange = ((currentGrossPay - previousGrossPay) / previousGrossPay) * 100;
      
      // Only show changes ±5%
      if (Math.abs(percentageChange) < 5) return null;
      
      // Determine reason based on pay component changes
      let reason = 'Pay Adjustment';
      
      const bonusChange = emp.bonus - (emp.previousMonth.bonus || 0);
      const overtimeChange = emp.overtime - (emp.previousMonth.overtime || 0);
      const basePayChange = emp.basePay - (emp.previousMonth.basePay || 0);
      const commissionChange = emp.commission - (emp.previousMonth.commission || 0);
      
      // Priority-based reason determination
      if (Math.abs(bonusChange) > 500) {
        reason = 'Bonus';
      } else if (Math.abs(overtimeChange) > 200) {
        reason = 'Overtime';
      } else if (Math.abs(commissionChange) > 300) {
        reason = 'Commission';
      } else if (basePayChange > 200) {
        reason = 'Salary Adjustment';
      } else if (basePayChange < -500) {
        reason = 'Sick Leave';
      } else if (basePayChange < -200) {
        reason = 'Maternity';
      } else if (percentageChange > 15) {
        reason = 'Bonus';
      } else if (percentageChange > 8) {
        reason = 'Salary Adjustment';
      } else if (percentageChange < -10) {
        reason = 'Sick Leave';
      } else if (percentageChange < -5) {
        reason = 'Maternity';
      } else {
        reason = 'Pay Adjustment';
      }
      
      return {
        employee: emp,
        percentageChange,
        reason,
        hasSignificantChange: true
      };
    })
    .filter(change => change && change.hasSignificantChange);

  // Prepare chart data with percentage changes
  const chartData = [
    {
      category: 'Employees',
      current: currentNetPay,
      previous: previousNetPay,
      currentFormatted: formatCurrency(currentNetPay),
      previousFormatted: formatCurrency(previousNetPay),
      change: netPayChange,
      color: '#10b981' // green
    },
    {
      category: 'HMRC',
      current: currentHMRC,
      previous: previousHMRC,
      currentFormatted: formatCurrency(currentHMRC),
      previousFormatted: formatCurrency(previousHMRC),
      change: hmrcChange,
      color: '#ef4444' // red
    },
    {
      category: 'Pension',
      current: currentPension,
      previous: previousPension,  
      currentFormatted: formatCurrency(currentPension),
      previousFormatted: formatCurrency(previousPension),
      change: pensionChange,
      color: '#f97316' // orange
    }
  ];

  // Custom label function for accessibility with proper null checks
  const renderCustomLabel = (props: any, dataKey: string) => {
    const { x, y, width, value, payload } = props;
    
    // Add null checks to prevent errors
    if (!payload || !x || !y || !width) {
      return null;
    }
    
    const data = payload;
    const changeValue = data?.change || 0;
    const formattedValue = dataKey === 'current' ? 
      (data?.currentFormatted || formatCurrency(value || 0)) : 
      (data?.previousFormatted || formatCurrency(value || 0));
    const changeText = changeValue !== 0 ? ` ${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(0)}%` : '';
    
    return (
      <text 
        x={x + width / 2} 
        y={y - 5} 
        fill="#374151" 
        textAnchor="middle" 
        fontSize="11"
        fontWeight="500"
      >
        {formattedValue}{dataKey === 'current' ? changeText : ''}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      {/* Employees with Gross Pay Changes - Dedicated Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-payroll-header">Employees with Gross Pay Changes vs Previous Month</h2>
          <p className="text-muted-foreground">Employees with notable gross pay changes vs last month</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {significantChanges.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No significant changes detected
              </p>
            ) : (
              <div className="space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 text-xs font-medium text-muted-foreground border-b border-border pb-2">
                  <div>Employee Name</div>
                  <div>Department</div>
                  <div>% Change</div>
                  <div>Reason</div>
                </div>
                
                {/* Table Rows */}
                <div className="space-y-2">
                  {significantChanges.slice(0, 5).map((change) => (
                    <div key={change!.employee.id} className="grid grid-cols-4 gap-4 text-sm items-center py-1">
                      <div className="font-medium">{change!.employee.name}</div>
                      <div className="text-muted-foreground">{change!.employee.department}</div>
                      <div className={`font-medium ${
                        change!.percentageChange >= 0 ? 'text-payroll-positive' : 'text-payroll-negative'
                      }`}>
                        {change!.percentageChange >= 0 ? '+' : ''}{change!.percentageChange.toFixed(0)}%
                      </div>
                      <div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            change!.reason === 'Bonus' ? 'bg-green-50 text-green-700 border-green-200' :
                            change!.reason === 'Maternity' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            change!.reason === 'Salary Adjustment' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            change!.reason === 'Overtime' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            change!.reason === 'Commission' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            change!.reason === 'Sick Leave' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {change!.reason}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                {significantChanges.length > 5 && (
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                    <span className="cursor-pointer hover:text-foreground transition-colors">
                      View More in Detailed Analysis • +{significantChanges.length - 5} more employees
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Total Changes Section */}
      <div className="space-y-4 mt-8">
        <div>
          <h2 className="text-xl font-semibold text-payroll-header">Total Changes</h2>
          <p className="text-muted-foreground">Payroll distribution breakdown with month-over-month comparison</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Changes Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total Changes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* To pay employees */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium">To pay employees</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{formatCurrency(currentNetPay)}</span>
                <div className="flex items-center gap-1">
                  {netPayChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-payroll-positive" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-payroll-negative" />
                  )}
                  <span className={`text-xs ${
                    netPayChange >= 0 ? 'text-payroll-positive' : 'text-payroll-negative'
                  }`}>
                    {netPayChange >= 0 ? '+' : ''}{Math.abs(netPayChange).toFixed(0)}% vs last month
                  </span>
                </div>
              </div>
            </div>

            {/* To pay HMRC */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Building className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-sm font-medium">To pay HMRC</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{formatCurrency(currentHMRC)}</span>
                <div className="flex items-center gap-1">
                  {hmrcChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-payroll-positive" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-payroll-negative" />
                  )}
                  <span className={`text-xs ${
                    hmrcChange >= 0 ? 'text-payroll-positive' : 'text-payroll-negative'
                  }`}>
                    {hmrcChange >= 0 ? '+' : ''}{Math.abs(hmrcChange).toFixed(0)}% vs last month
                  </span>
                </div>
              </div>
            </div>

            {/* To pay Pension provider */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium">To pay Pension provider</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{formatCurrency(currentPension)}</span>
                <div className="flex items-center gap-1">
                  {pensionChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-payroll-positive" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-payroll-negative" />
                  )}
                  <span className={`text-xs ${
                    pensionChange >= 0 ? 'text-payroll-positive' : 'text-payroll-negative'
                  }`}>
                    {pensionChange >= 0 ? '+' : ''}{Math.abs(pensionChange).toFixed(0)}% vs last month
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparative Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5" />
              Current vs Previous Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="current" 
                    name="Current Month"
                    fill="#10b981"
                    stroke="#059669"
                    strokeWidth={1}
                    radius={[3, 3, 0, 0]}
                  >
                    <LabelList 
                      content={(props) => renderCustomLabel(props, 'current')}
                    />
                  </Bar>
                  <Bar 
                    dataKey="previous" 
                    name="Previous Month"
                    fill="#86efac"
                    stroke="#059669"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    opacity={0.8}
                    radius={[3, 3, 0, 0]}
                  >
                    <LabelList 
                      content={(props) => renderCustomLabel(props, 'previous')}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};
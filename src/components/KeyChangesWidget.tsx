import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Wallet, Building, Shield } from 'lucide-react';
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

  // Calculate employees with significant changes for the second card
  const significantChanges = employees
    .map(emp => {
      if (!emp.previousMonth) return null;
      
      const incomeChange = emp.totalIncome - emp.previousMonth.totalIncome;
      const deductionsChange = emp.deductions - emp.previousMonth.deductions;
      const takeHomeChange = emp.takeHomePay - emp.previousMonth.takeHomePay;
      const employerCostChange = emp.employerCost - emp.previousMonth.employerCost;
      
      // Determine which sections have significant changes (>£50 threshold)
      const changes = [];
      if (Math.abs(incomeChange) > 50) {
        changes.push({ type: 'income', change: incomeChange, label: 'Income' });
      }
      if (Math.abs(deductionsChange) > 50) {
        changes.push({ type: 'deductions', change: deductionsChange, label: 'Deductions' });
      }
      if (Math.abs(employerCostChange) > 50) {
        changes.push({ type: 'employer', change: employerCostChange, label: 'Employer Cost' });
      }
      
      return {
        employee: emp,
        changes,
        hasSignificantChange: changes.length > 0
      };
    })
    .filter(change => change && change.hasSignificantChange);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-payroll-header">Key Changes vs Previous Month</h2>
        <p className="text-muted-foreground">
          Notable differences in payroll calculations
        </p>
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

        {/* Employees with Significant Changes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Employees with Major Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {significantChanges.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No significant changes detected
              </p>
            ) : (
              <div className="space-y-4">
                {significantChanges.slice(0, 3).map((change) => (
                  <div key={change!.employee.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{change!.employee.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {change!.employee.department}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {change!.changes.length} section{change!.changes.length > 1 ? 's' : ''} changed
                      </div>
                    </div>
                    
                    {/* Multiple change badges */}
                    <div className="flex flex-wrap gap-2">
                      {change!.changes.map((changeItem, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              changeItem.change >= 0 ? 'text-payroll-positive border-payroll-positive/20' : 'text-payroll-negative border-payroll-negative/20'
                            }`}
                          >
                            {changeItem.label}: {changeItem.change >= 0 ? '+' : ''}{formatCurrency(Math.abs(changeItem.change))}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {significantChanges.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                    +{significantChanges.length - 3} more employees with changes
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
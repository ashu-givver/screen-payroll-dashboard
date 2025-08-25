import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from 'lucide-react';
import { employees } from '@/data/employees';
import { formatCurrency } from '@/lib/formatters';

export const KeyChangesWidget = () => {
  // Calculate key changes from previous month across all sections
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

  const totalIncomeChange = employees.reduce((sum, emp) => {
    if (!emp.previousMonth) return sum;
    return sum + (emp.totalIncome - emp.previousMonth.totalIncome);
  }, 0);

  const totalTakeHomeChange = employees.reduce((sum, emp) => {
    if (!emp.previousMonth) return sum;
    return sum + (emp.takeHomePay - emp.previousMonth.takeHomePay);
  }, 0);

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
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Income Change</span>
              <div className="flex items-center gap-1">
                {totalIncomeChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-payroll-positive" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-payroll-negative" />
                )}
                <span className={`font-semibold ${
                  totalIncomeChange >= 0 ? 'text-payroll-positive' : 'text-payroll-negative'
                }`}>
                  {formatCurrency(Math.abs(totalIncomeChange))}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Take-Home Change</span>
              <div className="flex items-center gap-1">
                {totalTakeHomeChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-payroll-positive" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-payroll-negative" />
                )}
                <span className={`font-semibold ${
                  totalTakeHomeChange >= 0 ? 'text-payroll-positive' : 'text-payroll-negative'
                }`}>
                  {formatCurrency(Math.abs(totalTakeHomeChange))}
                </span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-sm text-muted-foreground">
                  {significantChanges.length} employees with significant changes
                </span>
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
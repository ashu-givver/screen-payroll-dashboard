import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, PoundSterling, CheckCircle } from 'lucide-react';
import { employees, payrollPeriod, payrollSummary } from '@/data/employees';
import { formatCurrency } from '@/lib/formatters';

export const ExecutiveSummary = () => {
  // Calculate key metrics
  const totalCost = payrollSummary.totalEmployerCost;
  const previousTotalCost = employees.reduce((sum, emp) => 
    sum + (emp.previousMonth?.employerCost || emp.employerCost), 0
  );
  const costChange = ((totalCost - previousTotalCost) / previousTotalCost) * 100;
  
  const approvedCount = employees.filter(emp => emp.status === 'Current').length;
  const approvalProgress = (approvedCount / employees.length) * 100;

  // Calculate joiners and leavers (mock data for demo - in real app this would come from data)
  const newJoiners = 1; // Number of new employees this month
  const leavers = 0; // Number of employees leaving this month
  const previousJoiners = 2; // Previous month joiners
  const previousLeavers = 1; // Previous month leavers
  
  const joinersChange = previousJoiners > 0 ? ((newJoiners - previousJoiners) / previousJoiners) * 100 : 0;
  const leaversChange = previousLeavers > 0 ? ((leavers - previousLeavers) / previousLeavers) * 100 : leavers === 0 ? -100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Payroll Cost */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💷 Payroll Cost</CardTitle>
            <PoundSterling className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-payroll-total">
              {formatCurrency(totalCost)}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {costChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-payroll-positive" />
              ) : (
                <TrendingDown className="h-3 w-3 text-payroll-negative" />
              )}
              <span className={costChange >= 0 ? 'text-payroll-positive' : 'text-payroll-negative'}>
                {Math.abs(costChange).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Employee Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">👥 Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <div className="space-y-1 mt-2">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">New Joiners: {newJoiners}</span>
                {joinersChange !== 0 && (
                  <>
                    {joinersChange >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-payroll-positive" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-payroll-negative" />
                    )}
                    <span className={joinersChange >= 0 ? 'text-payroll-positive' : 'text-payroll-negative'}>
                      {joinersChange >= 0 ? '+' : ''}{Math.abs(joinersChange).toFixed(0)}% vs last month
                    </span>
                  </>
                )}
                {joinersChange === 0 && (
                  <span className="text-muted-foreground">same as last month</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">Leavers: {leavers}</span>
                {leaversChange !== 0 && (
                  <>
                    {leaversChange >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-payroll-negative" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-payroll-positive" />
                    )}
                    <span className={leaversChange >= 0 ? 'text-payroll-negative' : 'text-payroll-positive'}>
                      {leaversChange >= 0 ? '+' : ''}{Math.abs(leaversChange).toFixed(0)}% vs last month
                    </span>
                  </>
                )}
                {leaversChange === 0 && (
                  <span className="text-muted-foreground">same as last month</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Until Payment Day */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">📅 Time Until Payment Day</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 days remaining</div>
            <div className="text-sm text-muted-foreground mt-2">
              Payment scheduled for 31 Jul 2025
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Payslips and submissions will be sent automatically on this date.
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
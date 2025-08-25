import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, CheckCircle } from 'lucide-react';
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

  const headcountChange = employees.length - employees.length; // This would be dynamic in real app

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-payroll-header">Executive Summary</h2>
        <p className="text-muted-foreground">
          {payrollPeriod.month} {payrollPeriod.year} payroll overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Payroll Cost */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>No change from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Approval Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}/{employees.length}</div>
            <Progress value={approvalProgress} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {approvalProgress.toFixed(0)}% approved
            </div>
          </CardContent>
        </Card>

        {/* Payroll Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payroll Status</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="secondary" className="bg-payroll-draft/20 text-payroll-draft border-payroll-draft/30">
                {payrollPeriod.status}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {payrollPeriod.startDate} - {payrollPeriod.endDate}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { employees, payrollPeriod } from '@/data/employees';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  className?: string;
}

export const QuickActions = ({ className }: QuickActionsProps) => {
  const { toast } = useToast();
  
  const approvedCount = employees.filter(emp => emp.status === 'Current').length;
  const pendingCount = employees.length - approvedCount;

  const monthNames = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];
  const currentMonthIndex = monthNames.findIndex(
    (m) => m.toLowerCase() === payrollPeriod.month.toLowerCase()
  );
  const previousMonthIndex = (currentMonthIndex + 11) % 12;
  const previousYear = currentMonthIndex === 0 ? payrollPeriod.year - 1 : payrollPeriod.year;
  const currentLabel = `${payrollPeriod.month} ${payrollPeriod.year}`;
  const previousLabel = `${monthNames[previousMonthIndex]} ${previousYear}`;

  const handleExportCurrent = () => {
    toast({
      title: 'Export started',
      description: `Gross/Net report for ${currentLabel} is being prepared.`,
    });
  };

  const handleExportPrevious = () => {
    toast({
      title: 'Export started',
      description: `Gross/Net report for ${previousLabel} is being prepared.`,
    });
  };
  const handleSendNotifications = () => {
    toast({
      title: 'Notifications Sent',
      description: `Sent approval reminders to ${pendingCount} employees.`,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h2 className="text-xl font-semibold text-payroll-header">Quick Actions</h2>
        <p className="text-muted-foreground">
          Essential tasks for payroll management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Approval Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved: {approvedCount}
                </Badge>
                {pendingCount > 0 && (
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending: {pendingCount}
                  </Badge>
                )}
              </div>
            </div>
            
            {pendingCount > 0 && (
              <Button 
                onClick={handleSendNotifications}
                className="w-full gap-2"
                variant="outline"
              >
                <Mail className="h-4 w-4" />
                Send Approval Reminders
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Export & Reports Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Reports & Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleExportCurrent}
              className="w-full gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Export Gross/Net Report — {currentLabel}
            </Button>

            <Button 
              onClick={handleExportPrevious}
              className="w-full gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Export Gross/Net Report — {previousLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import { PersonaBasedDashboard } from '@/components/PersonaBasedDashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { payrollCycles } from '@/data/payrollCycles';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

const PreviewIndex = () => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Get the current payroll cycle (assuming it's the first "Current" one)
  const currentCycle = payrollCycles.find(cycle => cycle.status === 'Current');
  
  const handleConfirmClick = () => {
    setShowConfirmDialog(true);
  };
  
  const handleClosePayroll = () => {
    setShowConfirmDialog(false);
    setShowSuccessDialog(true);
  };
  
  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-foreground hover:text-foreground/80">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-medium text-foreground">
                {currentCycle?.period || 'July 2025 Payroll'} Dashboard
              </h1>
              <Badge 
                variant={currentCycle?.status === 'Current' ? 'secondary' : 'default'}
                className="ml-2"
              >
                {currentCycle?.status === 'Current' ? 'In Progress' : currentCycle?.status || 'In Progress'}
              </Badge>
            </div>
            <Button 
              variant="default" 
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleConfirmClick}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>

      <PersonaBasedDashboard />
      
      {/* Confirmation Modal */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this payroll?</AlertDialogTitle>
            <AlertDialogDescription>
              Once you close this payroll, you will not be able to edit it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClosePayroll}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Yes, close payroll
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Success Modal */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payroll closed successfully</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>Your payroll has been closed. On Payment Day (e.g. 30/08/25) the following will happen automatically:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Payslips will be sent to all employees.</li>
                <li>FPS will be submitted to HMRC.</li>
                <li>Pension submissions will be sent to your provider.</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessClose}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PreviewIndex;
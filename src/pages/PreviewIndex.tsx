import { PersonaBasedDashboard } from '@/components/PersonaBasedDashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Download, FileText } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const PreviewIndex = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentView, setCurrentView] = useState<'summary' | 'detailed'>('summary');
  
  // Get the current payroll cycle (assuming it's the first "Current" one)
  const currentCycle = payrollCycles.find(cycle => cycle.status === 'Current');
  
  const handleConfirmClick = () => {
    setShowConfirmDialog(true);
  };

  const handleExportReport = (month: string, year: string) => {
    toast({
      title: "Export Started",
      description: `Downloading GrossNetReport_${month}${year}.pdf...`,
    });
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
      <PersonaBasedDashboard onViewChange={setCurrentView} />
      
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
      
      {/* Success Modal - User-Friendly Design */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md mx-auto">
          <div className="text-center space-y-6 py-4">
            {/* Illustration/Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-300 rounded-full"></div>
                <div className="absolute -bottom-1 -left-2 w-4 h-4 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Payroll closed successfully 🎉
              </h2>
              <p className="text-muted-foreground">
                Your payroll has been closed. On Payment Day (e.g. 30/08/25) the following will happen automatically:
              </p>
            </div>
            
            {/* Checklist */}
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">Payslips will be sent to all employees.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">FPS will be submitted to HMRC.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">Pension submissions will be sent to your provider.</span>
              </div>
            </div>
            
            {/* CTA Button */}
            <Button 
              onClick={handleSuccessClose}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviewIndex;
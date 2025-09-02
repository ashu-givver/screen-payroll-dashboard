import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, MoreHorizontal, Play, ArrowLeft } from 'lucide-react';
import { PayrollPeriod } from '@/types/payroll';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PayrollHeaderProps {
  period: PayrollPeriod;
  onConfirm: () => void;
  onDownload?: () => void;
}

export const PayrollHeader = ({ 
  period, 
  onConfirm,
  onDownload,
}: PayrollHeaderProps) => {
  return (
    <TooltipProvider>
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-foreground hover:text-foreground/80">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-payroll-header">
                {period.month} {period.year}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>•</span>
                <span>{period.employeeCount} Employees</span>
                <span>•</span>
                <Badge 
                  className="bg-amber-400 text-black border-amber-400 hover:bg-amber-400/80"
                  aria-label="Payroll in progress"
                >
                  <Play className="h-3 w-3 mr-1" />
                  IN PROGRESS
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="p-2">
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download reports</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={onDownload}>
                    Gross to Net – June 2025
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDownload}>
                    Gross to Net – July 2025
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
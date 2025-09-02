import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, comment?: string) => void;
  paymentType: string;
  employeeName: string;
  currentAmount: number;
}

const getPaymentTypeLabel = (field: string): string => {
  const labels: Record<string, string> = {
    basePay: 'Base Pay',
    bonus: 'Bonus',
    commission: 'Commission',
    overtime: 'Overtime',
    gifFlex: 'GIF Flex',
    onCall: 'OnCall'
  };
  return labels[field] || field;
};

const getPaymentTypeBadge = (field: string): string => {
  const badges: Record<string, string> = {
    basePay: 'Base Pay',
    bonus: 'Bonus',
    commission: 'Commission', 
    overtime: 'Overtime',
    gifFlex: 'NI Contribution Only',
    onCall: 'OnCall'
  };
  return badges[field] || field;
};

export const AddPaymentModal = ({
  isOpen,
  onClose,
  onSave,
  paymentType,
  employeeName,
  currentAmount
}: AddPaymentModalProps) => {
  const [amount, setAmount] = useState(currentAmount.toString());
  const [comment, setComment] = useState('');

  const handleSave = () => {
    const numericAmount = parseFloat(amount) || 0;
    onSave(numericAmount, comment.trim() || undefined);
    setAmount('');
    setComment('');
    onClose();
  };

  const handleCancel = () => {
    setAmount(currentAmount.toString());
    setComment('');
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-semibold">Add Payment</DialogTitle>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {getPaymentTypeBadge(paymentType)}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Context Information */}
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Employee:</span>
              <span className="font-medium">{employeeName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Payroll Month:</span>
              <span className="font-medium">December 2024</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Payment Type:</span>
              <span className="font-medium">{getPaymentTypeLabel(paymentType)}</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                £
              </span>
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="pl-7"
                autoFocus
              />
            </div>
          </div>

          {/* Comment Input */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Comment <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[80px]"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleSave} 
              className="w-full"
              disabled={!amount || parseFloat(amount) < 0}
            >
              Save
            </Button>
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
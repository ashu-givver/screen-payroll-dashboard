import { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { X, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [currency, setCurrency] = useState('GBP');
  const [frequency, setFrequency] = useState('Fixed');
  const [date, setDate] = useState<Date>(new Date());

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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-xl font-medium">Add Payment</DialogTitle>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1 text-sm font-medium">
                {getPaymentTypeBadge(paymentType)}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Currency and Amount Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">Currency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Amount</label>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Amount"
                className="h-12"
                autoFocus
              />
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Frequency</label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Fixed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fixed">Fixed</SelectItem>
                <SelectItem value="Variable">Variable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "MMMM yyyy") : <span>MMMM YYYY</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comments"
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            className="w-full h-12 text-base"
            disabled={!amount || parseFloat(amount) < 0}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
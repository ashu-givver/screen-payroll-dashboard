import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { CustomView } from '@/types/payroll';

interface CustomViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (view: Omit<CustomView, 'id'>) => void;
  existingView?: CustomView;
  isEdit?: boolean;
}

const availableFields = [
  { id: 'basePay', label: 'Base Pay', category: 'Income' },
  { id: 'bonus', label: 'Bonus', category: 'Income' },
  { id: 'commission', label: 'Commission', category: 'Income' },
  { id: 'overtime', label: 'Overtime', category: 'Income' },
  { id: 'gifFlex', label: 'GIF Flex', category: 'Income' },
  { id: 'onCall', label: 'On Call', category: 'Income' },
  { id: 'totalIncome', label: 'Gross Pay', category: 'Income' },
  { id: 'incomeTax', label: 'Income Tax', category: 'Deductions' },
  { id: 'nationalInsurance', label: 'National Insurance (Employee)', category: 'Deductions' },
  { id: 'pension', label: 'Pension (Employee)', category: 'Deductions' },
  { id: 'studentLoan', label: 'Student Loan', category: 'Deductions' },
  { id: 'deductions', label: 'Total Deductions', category: 'Deductions' },
  { id: 'employerNI', label: 'National Insurance (Employer)', category: 'Employer Cost' },
  { id: 'employerPension', label: 'Pension (Employer)', category: 'Employer Cost' },
  { id: 'takeHomePay', label: 'Net Pay', category: 'Net Pay' },
];

const groupedFields = availableFields.reduce((acc, field) => {
  if (!acc[field.category]) {
    acc[field.category] = [];
  }
  acc[field.category].push(field);
  return acc;
}, {} as Record<string, typeof availableFields>);

export const CustomViewModal = ({
  isOpen,
  onClose,
  onSave,
  existingView,
  isEdit = false
}: CustomViewModalProps) => {
  const [viewName, setViewName] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  useEffect(() => {
    if (existingView) {
      setViewName(existingView.name);
      setSelectedFields(existingView.fields);
    } else {
      setViewName('');
      setSelectedFields([]);
    }
  }, [existingView, isOpen]);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSave = () => {
    if (!viewName.trim() || selectedFields.length === 0) {
      return;
    }

    onSave({
      name: viewName.trim(),
      fields: selectedFields,
      createdAt: existingView?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Reset form
    setViewName('');
    setSelectedFields([]);
    onClose();
  };

  const handleCancel = () => {
    setViewName(existingView?.name || '');
    setSelectedFields(existingView?.fields || []);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Custom View' : 'Create Custom View'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* View Name */}
          <div className="space-y-2">
            <Label htmlFor="viewName">View Name</Label>
            <Input
              id="viewName"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder="e.g., Finance View, HR View"
              className="w-full"
            />
          </div>

          <Separator />

          {/* Field Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Select Fields to Display</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Choose which columns you want to see in your custom view
              </p>
            </div>

            {Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-sm text-primary">{category}</h4>
                <div className="grid grid-cols-2 gap-3 pl-4">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={field.id}
                        checked={selectedFields.includes(field.id)}
                        onCheckedChange={() => handleFieldToggle(field.id)}
                      />
                      <Label
                        htmlFor={field.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!viewName.trim() || selectedFields.length === 0}
          >
            {isEdit ? 'Update View' : 'Create View'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
import { useState } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Edit3 } from 'lucide-react';
import { AddPaymentModal } from './AddPaymentModal';

interface EditableCellProps {
  value: number;
  onSave: (newValue: number) => void;
  field: string;
  employeeName: string;
  className?: string;
  showZeroAs?: string;
}

export const EditableCell = ({ 
  value, 
  onSave, 
  field, 
  employeeName, 
  className = "",
  showZeroAs = "-"
}: EditableCellProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleModalSave = (amount: number, comment?: string) => {
    onSave(amount);
  };

  const getFieldLabel = (field: string) => {
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

  return (
    <>
      <div 
        className={`relative cursor-pointer group hover:bg-blue-50/50 px-1 py-0.5 rounded transition-colors ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
        title={`Click to edit ${getFieldLabel(field)} for ${employeeName}`}
      >
        <span className="text-xs">
          {value > 0 ? formatCurrency(value) : showZeroAs}
        </span>
        {isHovered && (
          <Edit3 className="absolute -right-1 top-0 h-3 w-3 text-blue-600 opacity-75" />
        )}
      </div>
      
      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        paymentType={field}
        employeeName={employeeName}
        currentAmount={value}
      />
    </>
  );
};
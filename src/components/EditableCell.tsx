import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';
import { Check, X, Edit3 } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const numericValue = parseFloat(inputValue) || 0;
    if (numericValue !== value) {
      onSave(numericValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value.toString());
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
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

  if (isEditing) {
    return (
      <div className="relative flex items-center gap-1">
        <Input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          className="h-6 text-xs w-full min-w-0 px-1"
          step="0.01"
          min="0"
        />
        <div className="flex items-center gap-1 absolute -right-12 top-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            className="h-6 w-6 p-0 text-green-600 hover:bg-green-50"
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative cursor-pointer group hover:bg-blue-50/50 px-1 py-0.5 rounded transition-colors ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsEditing(true)}
      title={`Click to edit ${getFieldLabel(field)} for ${employeeName}`}
    >
      <span className="text-xs">
        {value > 0 ? formatCurrency(value) : showZeroAs}
      </span>
      {isHovered && !isEditing && (
        <Edit3 className="absolute -right-1 top-0 h-3 w-3 text-blue-600 opacity-75" />
      )}
    </div>
  );
};
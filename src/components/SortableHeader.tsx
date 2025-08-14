import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type SortDirection = 'asc' | 'desc' | null;

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSort: { key: string; direction: SortDirection };
  onSort: (key: string, direction: SortDirection) => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const SortableHeader = ({ 
  children, 
  sortKey, 
  currentSort, 
  onSort, 
  className = "",
  align = 'left'
}: SortableHeaderProps) => {
  const handleSort = () => {
    let newDirection: SortDirection = 'asc';
    
    if (currentSort.key === sortKey) {
      if (currentSort.direction === 'asc') {
        newDirection = 'desc';
      } else if (currentSort.direction === 'desc') {
        newDirection = null;
      } else {
        newDirection = 'asc';
      }
    }
    
    onSort(sortKey, newDirection);
  };

  const getSortIcon = () => {
    if (currentSort.key !== sortKey || !currentSort.direction) {
      return <ChevronsUpDown className="h-3 w-3 text-gray-400" />;
    }
    
    return currentSort.direction === 'asc' 
      ? <ChevronUp className="h-3 w-3 text-blue-600" />
      : <ChevronDown className="h-3 w-3 text-blue-600" />;
  };

  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center', 
    right: 'justify-end'
  }[align];

  return (
    <Button
      variant="ghost"
      onClick={handleSort}
      className={`h-8 w-full ${alignmentClass} px-2 py-1 font-medium text-xs text-gray-700 hover:bg-gray-100 border-0 rounded-none ${className}`}
    >
      <span className="truncate">{children}</span>
      <div className="ml-1 flex-shrink-0">
        {getSortIcon()}
      </div>
    </Button>
  );
};
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NotionTableProps {
  children: ReactNode;
  className?: string;
}

interface NotionTableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface NotionTableBodyProps {
  children: ReactNode;
  className?: string;
}

interface NotionTableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface NotionTableCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface NotionTableHeadProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export const NotionTable = ({ children, className }: NotionTableProps) => {
  return (
    <div className={cn("overflow-x-auto bg-background", className)}>
      <div className="min-w-full">
        <table className="w-full">
          {children}
        </table>
      </div>
    </div>
  );
};

export const NotionTableHeader = ({ children, className }: NotionTableHeaderProps) => {
  return (
    <thead className={cn("bg-muted/30", className)}>
      {children}
    </thead>
  );
};

export const NotionTableBody = ({ children, className }: NotionTableBodyProps) => {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
};

export const NotionTableRow = ({ children, className, onClick }: NotionTableRowProps) => {
  return (
    <tr 
      className={cn(
        "border-b border-border hover:bg-muted/20 transition-colors",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const NotionTableHead = ({ children, className, align = 'left', width }: NotionTableHeadProps) => {
  return (
    <th 
      className={cn(
        "px-4 py-3 text-sm font-medium text-muted-foreground border-b border-border",
        align === 'left' && "text-left",
        align === 'center' && "text-center", 
        align === 'right' && "text-right",
        className
      )}
      style={width ? { width } : undefined}
    >
      {children}
    </th>
  );
};

export const NotionTableCell = ({ children, className, align = 'left', width }: NotionTableCellProps) => {
  return (
    <td 
      className={cn(
        "px-4 py-3 text-sm text-foreground",
        align === 'left' && "text-left",
        align === 'center' && "text-center",
        align === 'right' && "text-right", 
        className
      )}
      style={width ? { width } : undefined}
    >
      {children}
    </td>
  );
};
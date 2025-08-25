import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PayrollTag } from '@/types/payroll';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TagsCellProps {
  tags: PayrollTag[];
  onTagClick?: (tagId: string) => void;
  maxVisible?: number;
  className?: string;
}

export const TagsCell = ({ 
  tags, 
  onTagClick, 
  maxVisible = 2,
  className = "" 
}: TagsCellProps) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!tags || tags.length === 0) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  const visibleTags = showAll ? tags : tags.slice(0, maxVisible);
  const hiddenCount = tags.length - maxVisible;

  const getTagVariant = (type: PayrollTag['type']) => {
    switch (type) {
      case 'employment':
        return 'secondary';
      case 'compensation':
        return 'default';
      case 'statutory':
        return 'outline';
      case 'other':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {visibleTags.map((tag) => (
        <Badge
          key={tag.id}
          variant={getTagVariant(tag.type)}
          className={`text-xs cursor-pointer hover:opacity-80 transition-opacity ${
            onTagClick ? 'hover:shadow-sm' : ''
          }`}
          onClick={() => onTagClick?.(tag.category)}
        >
          {tag.label}
        </Badge>
      ))}
      
      {!showAll && hiddenCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowAll(true)}
              >
                +{hiddenCount}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {tags.slice(maxVisible).map((tag) => (
                  <div key={tag.id} className="text-xs">{tag.label}</div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {showAll && hiddenCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowAll(false)}
        >
          Less
        </Button>
      )}
    </div>
  );
};
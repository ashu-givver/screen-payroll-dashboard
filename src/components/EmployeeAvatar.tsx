import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeeAvatarProps {
  name: string;
  initials: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base'
};

export const EmployeeAvatar = ({ name, initials, avatar, size = 'md' }: EmployeeAvatarProps) => {
  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback className="bg-muted text-muted-foreground font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
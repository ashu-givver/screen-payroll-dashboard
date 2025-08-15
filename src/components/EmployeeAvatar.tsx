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

const avatarColors = [
  'bg-red-500',
  'bg-blue-500', 
  'bg-green-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-amber-500',
  'bg-cyan-500'
];

const getAvatarColor = (name: string) => {
  // Generate a consistent color based on the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export const EmployeeAvatar = ({ name, initials, avatar, size = 'md' }: EmployeeAvatarProps) => {
  const colorClass = getAvatarColor(name);
  
  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback className={`${colorClass} text-white font-medium`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
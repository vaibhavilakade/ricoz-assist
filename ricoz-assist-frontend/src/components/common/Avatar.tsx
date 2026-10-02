import { getInitials } from '../../utils/formatting';
import { cn } from '../../utils/cn';

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = ({ firstName, lastName, className, size = 'md' }: AvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary font-medium text-white ring-2 ring-white',
        sizeClasses[size],
        className
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
};

export default Avatar;

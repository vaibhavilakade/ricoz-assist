import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70',
    warning: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/70',
    danger: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/70',
    info: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200/70',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;

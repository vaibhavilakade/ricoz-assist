import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:opacity-55',
          {
            'min-h-9 px-3.5 text-xs': size === 'sm',
            'min-h-10 px-4 text-sm': size === 'md',
            'min-h-12 px-6 text-base': size === 'lg',
          },
          {
            'bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow focus-visible:ring-primary/25': variant === 'primary',
            'border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-300': variant === 'secondary',
            'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-300': variant === 'danger',
            'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-300': variant === 'ghost',
          },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

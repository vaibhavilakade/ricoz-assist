import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-60',
          'box-border',
          {
            'h-[42px] px-[18px] text-[13px] rounded-[999px]': size === 'md' && variant === 'primary',
            'h-9 px-4 text-sm rounded-lg': size === 'sm',
            'h-10 px-5 text-base rounded-lg': size === 'md' && variant !== 'primary',
            'h-12 px-7 text-lg rounded-lg': size === 'lg',
          },
          {
            'bg-[rgb(185,28,28)] text-white hover:bg-[rgb(153,27,27)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgb(185,28,28)] focus-visible:outline-offset-[3px]': variant === 'primary',
            'border border-foreground/20 bg-white text-foreground hover:border-primary hover:text-primary focus-visible:ring-primary/20': variant === 'secondary',
            'bg-error text-white hover:bg-error/90 focus-visible:ring-error/30': variant === 'danger',
            'text-foreground hover:bg-muted/50 hover:text-primary focus-visible:ring-primary/20': variant === 'ghost',
            'bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent/30': variant === 'accent',
          },
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

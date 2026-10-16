import { InputHTMLAttributes, forwardRef, useId, useState } from 'react';
import { cn } from '../../utils/cn';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type = 'text', icon, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id || props.name || generatedId;
    const errorId = error && fieldId ? `${fieldId}-error` : undefined;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={fieldId}
            type={inputType}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            className={cn(
              'w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-foreground transition-all duration-150',
              'placeholder:text-foreground-muted',
              'hover:border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10',
              'disabled:cursor-not-allowed disabled:bg-muted disabled:text-foreground-muted',
              icon && 'pl-12',
              isPassword && 'pr-12',
              error && 'border-error focus:border-error focus:ring-error/10',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="auth-password-toggle absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

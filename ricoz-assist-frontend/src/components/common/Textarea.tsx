import { TextareaHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id || props.name || generatedId;
    const errorId = error && fieldId ? `${fieldId}-error` : undefined;

    return (
      <div className="w-full">
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            'w-full resize-y rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-gray-900 shadow-sm transition',
            'placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-100',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

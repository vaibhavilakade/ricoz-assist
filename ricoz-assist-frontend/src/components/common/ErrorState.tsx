import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = 'We couldn’t load this content',
  description = 'Check your connection and try again.',
  onRetry,
}: ErrorStateProps) => (
  <div
    className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 px-6 py-12 text-center"
    role="alert"
  >
    <div className="mb-4 rounded-2xl bg-white p-3 text-red-600 shadow-sm">
      <AlertTriangle className="h-6 w-6" aria-hidden="true" />
    </div>
    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    <p className="mt-1 max-w-md text-sm leading-6 text-gray-600">{description}</p>
    {onRetry && (
      <Button className="mt-5" variant="secondary" onClick={onRetry}>
        <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
        Try again
      </Button>
    )}
  </div>
);

export default ErrorState;

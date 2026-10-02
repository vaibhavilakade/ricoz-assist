import { FileText, Calendar, CheckSquare, MessageSquare, Database } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'documents' | 'meetings' | 'action-items' | 'queries' | 'knowledge-bases' | 'default';
}

const EmptyState = ({ title, description, action, type = 'default' }: EmptyStateProps) => {
  const icons = {
    documents: FileText,
    meetings: Calendar,
    'action-items': CheckSquare,
    queries: MessageSquare,
    'knowledge-bases': Database,
    default: FileText,
  };

  const Icon = icons[type] || icons.default;

  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center">
      <div className="mb-4 rounded-2xl bg-indigo-50 p-4">
        <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-6 text-gray-500">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-5">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

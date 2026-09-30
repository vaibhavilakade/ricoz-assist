import { FileText, Calendar, CheckSquare, MessageSquare, Database } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mb-4 text-sm text-gray-500">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { actionItemService } from '../services/actionItemService';
import { ActionItemDTO, ActionItemStatus, Priority } from '../types/domain';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import PageHeader from '../components/common/PageHeader';
import ErrorState from '../components/common/ErrorState';
import { ACTION_ITEM_STATUSES, PRIORITIES } from '../utils/constants';
import { formatDateTime } from '../utils/formatting';
import { Plus } from 'lucide-react';

const ActionItemsPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [actionItems, setActionItems] = useState<ActionItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Priority,
    status: 'OPEN' as ActionItemStatus,
    dueDate: '',
  });

  useEffect(() => {
    loadActionItems();
  }, [user?.id]);

  const loadActionItems = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const items = await actionItemService.getByAssignedTo(user?.id || '');
      setActionItems(items);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await actionItemService.create({
        ...formData,
        assignedToId: user?.id,
      });
      addToast({ type: 'success', message: 'Action item created' });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', priority: 'MEDIUM', status: 'OPEN', dueDate: '' });
      loadActionItems();
    } catch (error: any) {
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to create action item' });
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await actionItemService.complete(id);
      addToast({ type: 'success', message: 'Action item completed' });
      loadActionItems();
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to complete action item' });
    }
  };

  const getPriorityVariant = (priority: Priority) => {
    switch (priority) {
      case 'URGENT': return 'danger';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'default';
      default: return 'default';
    }
  };

  return (
    <div>
      <PageHeader
        title="Action items"
        description="Stay on top of priorities and track the work assigned to you."
        action={<Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Action Item
        </Button>}
      />

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center"><LoadingSpinner size="lg" /></div>
      ) : hasError ? (
        <ErrorState onRetry={loadActionItems} />
      ) : actionItems.length === 0 ? (
        <EmptyState
          title="No action items found"
          description="Create your first action item to get started"
          action={{ label: 'Create Action Item', onClick: () => setIsModalOpen(true) }}
          type="action-items"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {actionItems.map((item) => (
            <Card key={item.id} className="flex min-h-52 flex-col transition duration-150 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-6 text-gray-900">{item.title}</h3>
                <Badge variant={getPriorityVariant(item.priority)}>
                  {PRIORITIES[item.priority]}
                </Badge>
              </div>
              {item.description && (
                <p className="mb-4 flex-1 text-sm leading-6 text-gray-600">{item.description}</p>
              )}
              <div className="mb-3 flex gap-2">
                <Badge variant={item.status === 'COMPLETED' ? 'success' : 'info'}>
                  {ACTION_ITEM_STATUSES[item.status]}
                </Badge>
                {item.aiExtracted && <Badge variant="default">AI Extracted</Badge>}
              </div>
              {item.dueDate && (
                <p className="mb-4 text-xs text-gray-500">Due {formatDateTime(item.dueDate)}</p>
              )}
              {item.status !== 'COMPLETED' && (
                <Button size="sm" className="mt-auto self-start" onClick={() => handleComplete(item.id)}>
                  Mark Complete
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Action Item">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
            options={Object.entries(PRIORITIES).map(([value, label]) => ({ value, label }))}
          />
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ActionItemsPage;

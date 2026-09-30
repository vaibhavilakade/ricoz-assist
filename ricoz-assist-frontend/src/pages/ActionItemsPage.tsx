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
import Select from '../components/common/Select';
import { ACTION_ITEM_STATUSES, PRIORITIES } from '../utils/constants';
import { formatDateTime } from '../utils/formatting';
import { Plus } from 'lucide-react';

const ActionItemsPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [actionItems, setActionItems] = useState<ActionItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    try {
      const items = await actionItemService.getByAssignedTo(user?.id || '');
      setActionItems(items);
    } catch (error) {
      console.error('Failed to load action items:', error);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Action Items</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Action Item
        </Button>
      </div>

      {actionItems.length === 0 ? (
        <EmptyState
          title="No action items found"
          description="Create your first action item to get started"
          action={{ label: 'Create Action Item', onClick: () => setIsModalOpen(true) }}
          type="action-items"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actionItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <Badge variant={getPriorityVariant(item.priority)}>
                  {PRIORITIES[item.priority]}
                </Badge>
              </div>
              {item.description && (
                <p className="mb-3 text-sm text-gray-600">{item.description}</p>
              )}
              <div className="mb-3 flex gap-2">
                <Badge variant={item.status === 'COMPLETED' ? 'success' : 'info'}>
                  {ACTION_ITEM_STATUSES[item.status]}
                </Badge>
                {item.aiExtracted && <Badge variant="default">AI Extracted</Badge>}
              </div>
              {item.dueDate && (
                <p className="mb-3 text-xs text-gray-500">Due: {formatDateTime(item.dueDate)}</p>
              )}
              {item.status !== 'COMPLETED' && (
                <Button size="sm" onClick={() => handleComplete(item.id)}>
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
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
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
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

import { useEffect, useState } from 'react';
import { useUIStore } from '../store/uiStore';
import { knowledgeBaseService } from '../services/knowledgeBaseService';
import { KnowledgeBaseDTO, AccessLevel } from '../types/domain';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { ACCESS_LEVELS } from '../utils/constants';
import { Plus } from 'lucide-react';

const KnowledgeBasesPage = () => {
  const { addToast } = useUIStore();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accessLevel: 'PRIVATE' as AccessLevel,
  });

  useEffect(() => {
    loadKnowledgeBases();
  }, []);

  const loadKnowledgeBases = async () => {
    try {
      const kbs = await knowledgeBaseService.getAll();
      setKnowledgeBases(kbs);
    } catch (error) {
      console.error('Failed to load knowledge bases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await knowledgeBaseService.create(formData);
      addToast({ type: 'success', message: 'Knowledge base created' });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', accessLevel: 'PRIVATE' });
      loadKnowledgeBases();
    } catch (error: any) {
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to create knowledge base' });
    }
  };

  const handleIndex = async (id: string) => {
    try {
      await knowledgeBaseService.index(id);
      addToast({ type: 'success', message: 'Knowledge base indexing started' });
      loadKnowledgeBases();
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to start indexing' });
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
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Bases</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Knowledge Base
        </Button>
      </div>

      {knowledgeBases.length === 0 ? (
        <EmptyState
          title="No knowledge bases found"
          description="Create your first knowledge base to start organizing documents"
          action={{ label: 'Create Knowledge Base', onClick: () => setIsModalOpen(true) }}
          type="knowledge-bases"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {knowledgeBases.map((kb) => (
            <Card key={kb.id} className="hover:shadow-md transition-shadow">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{kb.name}</h3>
                <Badge variant={kb.indexed ? 'success' : 'warning'}>
                  {kb.indexed ? 'Indexed' : 'Not Indexed'}
                </Badge>
              </div>
              {kb.description && (
                <p className="mb-3 text-sm text-gray-600">{kb.description}</p>
              )}
              <div className="mb-3 flex gap-2">
                <Badge variant="info">{ACCESS_LEVELS[kb.accessLevel]}</Badge>
                <Badge variant="default">{kb.documentCount} documents</Badge>
              </div>
              {!kb.indexed && (
                <Button size="sm" onClick={() => handleIndex(kb.id)}>
                  Index
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Knowledge Base">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            label="Access Level"
            value={formData.accessLevel}
            onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as AccessLevel })}
            options={Object.entries(ACCESS_LEVELS).map(([value, label]) => ({ value, label }))}
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

export default KnowledgeBasesPage;

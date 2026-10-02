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
import Textarea from '../components/common/Textarea';
import PageHeader from '../components/common/PageHeader';
import ErrorState from '../components/common/ErrorState';
import { ACCESS_LEVELS } from '../utils/constants';
import { Plus } from 'lucide-react';

const KnowledgeBasesPage = () => {
  const { addToast } = useUIStore();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
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
    setIsLoading(true);
    setHasError(false);
    try {
      const kbs = await knowledgeBaseService.getAll();
      setKnowledgeBases(kbs);
    } catch {
      setHasError(true);
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

  return (
    <div>
      <PageHeader
        title="Knowledge bases"
        description="Organize shared knowledge and make your team's information easier to find."
        action={<Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Knowledge Base
        </Button>}
      />

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center"><LoadingSpinner size="lg" /></div>
      ) : hasError ? (
        <ErrorState onRetry={loadKnowledgeBases} />
      ) : knowledgeBases.length === 0 ? (
        <EmptyState
          title="No knowledge bases found"
          description="Create your first knowledge base to start organizing documents"
          action={{ label: 'Create Knowledge Base', onClick: () => setIsModalOpen(true) }}
          type="knowledge-bases"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {knowledgeBases.map((kb) => (
            <Card key={kb.id} className="flex min-h-52 flex-col transition duration-150 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-6 text-gray-900">{kb.name}</h3>
                <Badge variant={kb.indexed ? 'success' : 'warning'}>
                  {kb.indexed ? 'Indexed' : 'Not Indexed'}
                </Badge>
              </div>
              {kb.description && (
                <p className="mb-4 flex-1 text-sm leading-6 text-gray-600">{kb.description}</p>
              )}
              <div className="mb-4 flex flex-wrap gap-2">
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
          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Select
            label="Access Level"
            value={formData.accessLevel}
            onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as AccessLevel })}
            options={Object.entries(ACCESS_LEVELS).map(([value, label]) => ({ value, label }))}
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

export default KnowledgeBasesPage;

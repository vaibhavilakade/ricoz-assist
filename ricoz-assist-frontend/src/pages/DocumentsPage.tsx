import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { documentService } from '../services/documentService';
import { DocumentDTO, DocumentStatus, DocumentType } from '../types/domain';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { DOCUMENT_STATUSES, DOCUMENT_TYPES } from '../utils/constants';
import { formatDateTime } from '../utils/formatting';
import { Plus, Search } from 'lucide-react';

const DocumentsPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'DRAFT' as DocumentStatus,
    documentType: 'OTHER' as DocumentType,
  });

  useEffect(() => {
    loadDocuments();
  }, [user?.id]);

  const loadDocuments = async () => {
    try {
      const docs = await documentService.getByOwner(user?.id || '');
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadDocuments();
      return;
    }
    try {
      const results = await documentService.search(searchQuery);
      setDocuments(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await documentService.create({
        ...formData,
        ownerId: user?.id,
      });
      addToast({ type: 'success', message: 'Document created successfully' });
      setIsModalOpen(false);
      setFormData({ title: '', content: '', status: 'DRAFT', documentType: 'OTHER' });
      loadDocuments();
    } catch (error: any) {
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to create document' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await documentService.delete(id);
      addToast({ type: 'success', message: 'Document deleted' });
      loadDocuments();
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to delete document' });
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
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex flex-1">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} variant="secondary">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title="No documents found"
          description="Create your first document to get started"
          action={{ label: 'Create Document', onClick: () => setIsModalOpen(true) }}
          type="documents"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                <Badge variant="info">{DOCUMENT_STATUSES[doc.status]}</Badge>
              </div>
              <p className="mb-3 text-sm text-gray-600 line-clamp-2">{doc.content || 'No content'}</p>
              <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                <span>{DOCUMENT_TYPES[doc.documentType]}</span>
                <span>•</span>
                <span>v{doc.version}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDateTime(doc.updatedAt)}</span>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Document">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Content</label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as DocumentStatus })}
            options={Object.entries(DOCUMENT_STATUSES).map(([value, label]) => ({ value, label }))}
          />
          <Select
            label="Type"
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value as DocumentType })}
            options={Object.entries(DOCUMENT_TYPES).map(([value, label]) => ({ value, label }))}
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

export default DocumentsPage;

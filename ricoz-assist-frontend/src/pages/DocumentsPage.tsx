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
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import PageHeader from '../components/common/PageHeader';
import ErrorState from '../components/common/ErrorState';
import { DOCUMENT_STATUSES, DOCUMENT_TYPES } from '../utils/constants';
import { formatDateTime } from '../utils/formatting';
import { Plus, Search } from 'lucide-react';

const DocumentsPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
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
    setIsLoading(true);
    setHasError(false);
    try {
      const docs = await documentService.getByOwner(user?.id || '');
      setDocuments(docs);
    } catch {
      setHasError(true);
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
    } catch {
      addToast({ type: 'error', message: 'Document search failed. Please try again.' });
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

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Create, search, and manage the documents in your workspace."
        action={<Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>}
      />

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center"><LoadingSpinner size="lg" /></div>
      ) : hasError ? (
        <ErrorState onRetry={loadDocuments} />
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <Input
            aria-label="Search documents"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} variant="secondary" className="shrink-0">
            <Search className="mr-2 h-4 w-4" aria-hidden="true" />
            Search
          </Button>
          </div>

          {documents.length === 0 ? (
            <EmptyState
              title={searchQuery ? 'No matching documents' : 'No documents yet'}
              description={searchQuery ? 'Try a different search term or clear your search.' : 'Create your first document to get started.'}
              action={searchQuery ? undefined : { label: 'Create Document', onClick: () => setIsModalOpen(true) }}
              type="documents"
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="flex min-h-52 flex-col transition duration-150 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 font-semibold leading-6 text-gray-900">{doc.title}</h3>
                <Badge variant={doc.status === 'PUBLISHED' ? 'success' : doc.status === 'ARCHIVED' ? 'default' : doc.status === 'DRAFT' ? 'warning' : 'info'}>{DOCUMENT_STATUSES[doc.status]}</Badge>
              </div>
              <p className="mb-4 line-clamp-2 flex-1 text-sm leading-6 text-gray-600">{doc.content || 'No content provided.'}</p>
              <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                <span>{DOCUMENT_TYPES[doc.documentType]}</span>
                <span aria-hidden="true">·</span>
                <span>v{doc.version}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                <span>{formatDateTime(doc.updatedAt)}</span>
                <button
                  onClick={() => handleDelete(doc.id)}
                  type="button"
                  className="rounded-lg px-2 py-1 font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Document">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Textarea
            label="Content"
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
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

export default DocumentsPage;

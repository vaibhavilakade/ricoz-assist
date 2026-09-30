import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { queryService } from '../services/queryService';
import { QueryDTO, QueryType } from '../types/domain';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
import { QUERY_TYPES, QUERY_STATUSES } from '../utils/constants';
import { Send } from 'lucide-react';

const QueriesPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [queryText, setQueryText] = useState('');
  const [queryType, setQueryType] = useState<QueryType>('GENERAL_QA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [queries, setQueries] = useState<QueryDTO[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    setIsProcessing(true);
    try {
      const query = await queryService.create({
        queryText,
        queryType,
        createdByUserId: user?.id,
      });
      setQueries([query, ...queries]);
      setQueryText('');
      addToast({ type: 'success', message: 'Query submitted' });

      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const updated = await queryService.getById(query.id);
          if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
            clearInterval(pollInterval);
            setQueries((prev) => prev.map((q) => (q.id === query.id ? updated : q)));
            setIsProcessing(false);
          }
        } catch (error) {
          clearInterval(pollInterval);
          setIsProcessing(false);
        }
      }, 2000);
    } catch (error: any) {
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to submit query' });
      setIsProcessing(false);
    }
  };

  const loadHistory = async () => {
    try {
      const history = await queryService.getByUser(user?.id || '');
      setQueries(history);
    } catch (error) {
      console.error('Failed to load query history:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">AI Queries</h1>

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Query Type</label>
            <Select
              value={queryType}
              onChange={(e) => setQueryType(e.target.value as QueryType)}
              options={Object.entries(QUERY_TYPES).map(([value, label]) => ({ value, label }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Your Query</label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isProcessing}
            />
          </div>
          <Button type="submit" isLoading={isProcessing}>
            <Send className="mr-2 h-4 w-4" />
            Submit Query
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Query History</h2>
        {queries.length === 0 ? (
          <p className="text-sm text-gray-500">No queries yet</p>
        ) : (
          queries.map((query) => (
            <Card key={query.id}>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{query.queryText}</p>
                  <Badge variant={query.status === 'COMPLETED' ? 'success' : 'info'}>
                    {QUERY_STATUSES[query.status]}
                  </Badge>
                </div>
                {query.processingTimeMs && (
                  <span className="text-xs text-gray-500">{query.processingTimeMs}ms</span>
                )}
              </div>
              {query.response && (
                <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                  <p className="font-medium mb-1">Response:</p>
                  <p>{query.response}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default QueriesPage;

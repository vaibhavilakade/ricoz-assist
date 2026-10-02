import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { queryService } from '../services/queryService';
import { QueryDTO, QueryType } from '../types/domain';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import PageHeader from '../components/common/PageHeader';
import ErrorState from '../components/common/ErrorState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { QUERY_TYPES, QUERY_STATUSES } from '../utils/constants';
import { Send, Sparkles } from 'lucide-react';

const QueriesPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [queryText, setQueryText] = useState('');
  const [queryType, setQueryType] = useState<QueryType>('GENERAL_QA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [queries, setQueries] = useState<QueryDTO[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);

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
    setIsHistoryLoading(true);
    setHistoryError(false);
    try {
      const history = await queryService.getByUser(user?.id || '');
      setQueries(history);
    } catch {
      setHistoryError(true);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  return (
    <div>
      <PageHeader
        title="AI queries"
        description="Ask a question and review your previous conversations in one place."
      />

      <Card className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-primary">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-gray-950">Ask your assistant</h2>
            <p className="mt-0.5 text-xs text-gray-500">Choose a query type and enter your question.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Select
              label="Query type"
              value={queryType}
              onChange={(e) => setQueryType(e.target.value as QueryType)}
              options={Object.entries(QUERY_TYPES).map(([value, label]) => ({ value, label }))}
            />
          </div>
          <Textarea
            label="Your question"
            rows={4}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="What would you like to know?"
            disabled={isProcessing}
          />
          <Button type="submit" isLoading={isProcessing}>
            <Send className="mr-2 h-4 w-4" aria-hidden="true" />
            Submit Query
          </Button>
        </form>
      </Card>

      <section aria-labelledby="query-history-heading">
        <div className="mb-4">
          <h2 id="query-history-heading" className="font-semibold text-gray-950">Query history</h2>
          <p className="mt-1 text-xs text-gray-500">Your recent questions and assistant responses</p>
        </div>
        {isHistoryLoading ? (
          <div className="flex min-h-48 items-center justify-center"><LoadingSpinner size="lg" /></div>
        ) : historyError ? (
          <ErrorState onRetry={loadHistory} />
        ) : queries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center">
            <p className="text-sm font-medium text-gray-800">No queries yet</p>
            <p className="mt-1 text-sm text-gray-500">Your submitted questions and responses will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queries.map((query) => (
              <Card key={query.id}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="whitespace-pre-wrap break-words text-sm font-medium leading-6 text-gray-900">{query.queryText}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant={query.status === 'COMPLETED' ? 'success' : query.status === 'FAILED' || query.status === 'TIMEOUT' ? 'danger' : 'warning'}>
                        {QUERY_STATUSES[query.status]}
                      </Badge>
                      <Badge variant="default">{QUERY_TYPES[query.queryType]}</Badge>
                    </div>
                  </div>
                  {query.processingTimeMs !== undefined && (
                    <span className="shrink-0 text-xs text-gray-500">{query.processingTimeMs} ms</span>
                  )}
                </div>
                {query.response && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-sm leading-6 text-gray-700">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Response</p>
                    <p className="whitespace-pre-wrap">{query.response}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default QueriesPage;

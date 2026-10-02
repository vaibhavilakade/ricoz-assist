import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { documentService } from '../services/documentService';
import { meetingService } from '../services/meetingService';
import { actionItemService } from '../services/actionItemService';
import { DocumentDTO, MeetingDTO, ActionItemDTO } from '../types/domain';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import PageHeader from '../components/common/PageHeader';
import { FileText, CalendarDays, CheckSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../utils/formatting';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const [meetings, setMeetings] = useState<MeetingDTO[]>([]);
  const [actionItems, setActionItems] = useState<ActionItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [docs, meets, items] = await Promise.all([
          documentService.getByOwner(user?.id || ''),
          meetingService.getByOwner(user?.id || ''),
          actionItemService.getByAssignedTo(user?.id || ''),
        ]);
        setDocuments(docs.slice(0, 5));
        setMeetings(meets.slice(0, 5));
        setActionItems(items.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      void loadData();
    }
  }, [user?.id]);

  return (
    <div>
      <PageHeader
        eyebrow="Your workspace"
        title={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}${user?.firstName ? `, ${user.firstName}` : ''}`}
        description="A clear view of the work, knowledge, and conversations moving your team forward."
      />

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Documents', count: documents.length, note: 'in your library', Icon: FileText, gradient: 'gradient-indigo' },
              { label: 'Meetings', count: meetings.length, note: 'on your calendar', Icon: CalendarDays, gradient: 'gradient-emerald' },
              { label: 'Action items', count: actionItems.length, note: 'assigned to you', Icon: CheckSquare, gradient: 'gradient-amber' },
            ].map(({ label, count, note, Icon, gradient }, index) => (
              <Card
                key={label}
                className="stat-card-hover card-enter relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 opacity-10">
                  <Icon className="h-full w-full text-gray-900" aria-hidden="true" />
                </div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className="mt-3 text-4xl font-bold tracking-tight text-gray-950">{count}</p>
                    <p className="mt-1.5 text-sm text-gray-500">{note}</p>
                  </div>
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${gradient} shadow-lg shadow-indigo-500/20`}>
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="card-enter" style={{ animationDelay: '300ms' }}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">Recent documents</h2>
                  <p className="mt-1 text-sm text-gray-500">The latest updates in your library</p>
                </div>
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              {documents.length === 0 ? (
                <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 px-6 py-8 text-center">
                  <FileText className="mx-auto h-10 w-10 text-gray-300" aria-hidden="true" />
                  <p className="mt-3 text-sm text-gray-500">No documents yet. Create one to get started.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="list-item-hover flex items-center justify-between gap-4 rounded-lg px-2 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-primary">
                          <FileText className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">{doc.title}</p>
                          <p className="mt-0.5 text-xs text-gray-500">Updated {formatDateTime(doc.updatedAt)}</p>
                        </div>
                      </div>
                      <Badge variant="info">{doc.status.replace('_', ' ')}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="card-enter" style={{ animationDelay: '350ms' }}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">Meetings</h2>
                  <p className="mt-1 text-sm text-gray-500">Your latest scheduled sessions</p>
                </div>
                <Link
                  to="/meetings"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              {meetings.length === 0 ? (
                <p className="rounded-xl bg-gray-50 px-4 py-5 text-sm text-gray-500">No meetings yet. Schedule a session when you’re ready.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {meetings.map((meeting) => (
                    <li
                      key={meeting.id}
                      className="list-item-hover flex items-center justify-between gap-4 rounded-lg px-2 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600">
                          <CalendarDays className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">{meeting.title}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{formatDateTime(meeting.scheduledStart)}</p>
                        </div>
                      </div>
                      <Badge variant={meeting.status === 'COMPLETED' ? 'success' : 'info'}>
                        {meeting.status.replace('_', ' ')}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="card-enter xl:col-span-2" style={{ animationDelay: '400ms' }}>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">Your action items</h2>
                  <p className="mt-1 text-sm text-gray-500">A short list of what needs your attention</p>
                </div>
                <Link
                  to="/action-items"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              {actionItems.length === 0 ? (
                <p className="rounded-xl bg-gray-50 px-4 py-5 text-sm text-gray-500">You’re all caught up. New action items will appear here.</p>
              ) : (
                <ul className="grid gap-x-8 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-y-0">
                  {actionItems.map((item) => (
                    <li
                      key={item.id}
                      className="list-item-hover flex items-center justify-between gap-3 rounded-lg border-b border-gray-100 px-2 py-3 last:border-0 sm:border-b sm:last:border-b"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600">
                          <CheckSquare className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                          {item.dueDate && <p className="mt-0.5 text-xs text-gray-500">Due {formatDateTime(item.dueDate)}</p>}
                        </div>
                      </div>
                      <Badge variant={item.status === 'COMPLETED' ? 'success' : 'warning'}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;

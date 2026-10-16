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
        description="Here's what's happening with your workspace today."
      />

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="mb-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Documents', count: documents.length, note: 'in your library', Icon: FileText, color: 'bg-primary' },
              { label: 'Meetings', count: meetings.length, note: 'on your calendar', Icon: CalendarDays, color: 'bg-accent' },
              { label: 'Action items', count: actionItems.length, note: 'assigned to you', Icon: CheckSquare, color: 'bg-primary' },
            ].map(({ label, count, note, Icon, color }, index) => (
              <Card
                key={label}
                className="card-enter relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 opacity-5">
                  <Icon className="h-full w-full text-foreground" aria-hidden="true" />
                </div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-foreground-muted">{label}</p>
                    <p className="mt-3 text-4xl font-bold tracking-tight text-foreground">{count}</p>
                    <p className="mt-2 text-sm text-foreground-secondary">{note}</p>
                  </div>
                  <span className={`flex h-14 w-14 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            <Card className="card-enter" style={{ animationDelay: '300ms' }}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Recent documents</h2>
                  <p className="mt-1 text-sm text-foreground-secondary">The latest updates in your library</p>
                </div>
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              {documents.length === 0 ? (
                <div className="rounded-xl bg-muted px-6 py-8 text-center">
                  <FileText className="mx-auto h-10 w-10 text-primary/40" aria-hidden="true" />
                  <p className="mt-3 text-sm text-foreground-secondary">No documents yet. Create one to get started.</p>
                </div>
              ) : (
                <ul className="divide-y divide-border-light">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="list-item-hover flex items-center justify-between gap-4 rounded-lg px-2 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">
                          <FileText className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                          <p className="mt-0.5 text-xs text-foreground-muted">Updated {formatDateTime(doc.updatedAt)}</p>
                        </div>
                      </div>
                      <Badge variant="info">{doc.status.replace('_', ' ')}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="card-enter" style={{ animationDelay: '350ms' }}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Meetings</h2>
                  <p className="mt-1 text-sm text-foreground-secondary">Your latest scheduled sessions</p>
                </div>
                <Link
                  to="/meetings"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              {meetings.length === 0 ? (
                <p className="rounded-xl bg-muted px-4 py-5 text-sm text-foreground-secondary">No meetings yet. Schedule a session when you’re ready.</p>
              ) : (
                <ul className="divide-y divide-border-light">
                  {meetings.map((meeting) => (
                    <li
                      key={meeting.id}
                      className="list-item-hover flex items-center justify-between gap-4 rounded-lg px-2 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-accent">
                          <CalendarDays className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{meeting.title}</p>
                          <p className="mt-0.5 text-xs text-foreground-secondary">{formatDateTime(meeting.scheduledStart)}</p>
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

            <Card className="card-enter xl:col-span-2 " style={{ animationDelay: '400ms' }}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Your action items</h2>
                  <p className="mt-1 text-sm text-foreground-secondary">A short list of what needs your attention</p>
                </div>
                <Link
                  to="/action-items"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              {actionItems.length === 0 ? (
                <p className="rounded-xl bg-muted px-4 py-5 text-sm text-foreground-secondary">You’re all caught up. New action items will appear here.</p>
              ) : (
                <ul className="grid gap-x-8 divide-y divide-border-light sm:grid-cols-2 sm:divide-y-0">
                  {actionItems.map((item) => (
                    <li
                      key={item.id}
                      className="list-item-hover flex items-center justify-between gap-3 rounded-lg border-b  px-2 py-3 last:border-0 sm:border-b sm:last:border-b"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">
                          <CheckSquare className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                          {item.dueDate && <p className="mt-0.5 text-xs text-foreground-secondary">Due {formatDateTime(item.dueDate)}</p>}
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

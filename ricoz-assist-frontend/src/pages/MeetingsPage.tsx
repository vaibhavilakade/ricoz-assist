import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { meetingService } from '../services/meetingService';
import { MeetingDTO } from '../types/domain';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import PageHeader from '../components/common/PageHeader';
import ErrorState from '../components/common/ErrorState';
import { MEETING_STATUSES } from '../utils/constants';
import { formatDateTime } from '../utils/formatting';
import { Plus } from 'lucide-react';

const MeetingsPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [meetings, setMeetings] = useState<MeetingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledStart: '',
    scheduledEnd: '',
  });

  useEffect(() => {
    loadMeetings();
  }, [user?.id]);

  const loadMeetings = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const meets = await meetingService.getByOwner(user?.id || '');
      setMeetings(meets);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await meetingService.create({
        ...formData,
        ownerId: user?.id,
      });
      addToast({ type: 'success', message: 'Meeting created successfully' });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', scheduledStart: '', scheduledEnd: '' });
      loadMeetings();
    } catch (error: any) {
      addToast({ type: 'error', message: error.response?.data?.message || 'Failed to create meeting' });
    }
  };

  const handleStart = async (id: string) => {
    try {
      await meetingService.startMeeting(id);
      addToast({ type: 'success', message: 'Meeting started' });
      loadMeetings();
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to start meeting' });
    }
  };

  const handleEnd = async (id: string) => {
    try {
      await meetingService.endMeeting(id);
      addToast({ type: 'success', message: 'Meeting ended' });
      loadMeetings();
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to end meeting' });
    }
  };

  return (
    <div>
      <PageHeader
        title="Meetings"
        description="Plan sessions, keep schedules organized, and manage meeting status."
        action={<Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Meeting
        </Button>}
      />

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center"><LoadingSpinner size="lg" /></div>
      ) : hasError ? (
        <ErrorState onRetry={loadMeetings} />
      ) : meetings.length === 0 ? (
        <EmptyState
          title="No meetings found"
          description="Schedule your first meeting to get started"
          action={{ label: 'Create Meeting', onClick: () => setIsModalOpen(true) }}
          type="meetings"
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="transition duration-150 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-6 text-gray-900">{meeting.title}</h3>
                <Badge variant={meeting.status === 'COMPLETED' ? 'success' : 'info'}>
                  {MEETING_STATUSES[meeting.status]}
                </Badge>
              </div>
              {meeting.description && (
                <p className="mb-4 text-sm leading-6 text-gray-600">{meeting.description}</p>
              )}
              <div className="mb-4 grid gap-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600 sm:grid-cols-2">
                <p><span className="block text-xs font-medium uppercase tracking-wide text-gray-400">Starts</span><span className="mt-1 block">{formatDateTime(meeting.scheduledStart)}</span></p>
                <p><span className="block text-xs font-medium uppercase tracking-wide text-gray-400">Ends</span><span className="mt-1 block">{formatDateTime(meeting.scheduledEnd)}</span></p>
              </div>
              <div className="flex gap-2">
                {meeting.status === 'SCHEDULED' && (
                  <Button size="sm" onClick={() => handleStart(meeting.id)}>
                    Start
                  </Button>
                )}
                {meeting.status === 'IN_PROGRESS' && (
                  <Button size="sm" variant="danger" onClick={() => handleEnd(meeting.id)}>
                    End
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Meeting">
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
          <Input
            label="Scheduled Start"
            type="datetime-local"
            value={formData.scheduledStart}
            onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
            required
          />
          <Input
            label="Scheduled End"
            type="datetime-local"
            value={formData.scheduledEnd}
            onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
            required
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

export default MeetingsPage;

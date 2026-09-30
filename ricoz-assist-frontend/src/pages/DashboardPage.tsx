import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { documentService } from '../services/documentService';
import { meetingService } from '../services/meetingService';
import { actionItemService } from '../services/actionItemService';
import { DocumentDTO, MeetingDTO, ActionItemDTO } from '../types/domain';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FileText, Calendar, CheckSquare } from 'lucide-react';

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
      loadData();
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Meetings</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{meetings.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Action Items</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{actionItems.length}</p>
            </div>
            <CheckSquare className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Documents</h2>
          {documents.length === 0 ? (
            <p className="text-sm text-gray-500">No documents yet</p>
          ) : (
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-500">{doc.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Upcoming Meetings</h2>
          {meetings.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming meetings</p>
          ) : (
            <ul className="space-y-3">
              {meetings.map((meeting) => (
                <li key={meeting.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{meeting.title}</p>
                    <p className="text-sm text-gray-500">{meeting.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Avatar from '../components/common/Avatar';
import PageHeader from '../components/common/PageHeader';
import { Camera, Shield, Check, Edit2 } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  const profileCompletion = [
    { label: 'Full name', completed: !!(user?.firstName && user?.lastName) },
    { label: 'Email verified', completed: !!user?.email },
  ];

  const completedCount = profileCompletion.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedCount / profileCompletion.length) * 100);

  const handleSave = () => {
    // TODO: Call existing profile update API when available
    setIsEditing(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Your profile"
        title="Profile"
        description="Manage your personal information and account settings"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Profile Card */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="relative group">
              <Avatar firstName={user?.firstName || user?.username} lastName={user?.lastName} size="lg" />
              <button
                type="button"
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Change profile picture"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.username}
                </h2>
                <p className="text-foreground-muted">{user?.email}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                  {user?.role || 'User'}
                </p>
              </div>
              
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="mr-2 h-4 w-4" aria-hidden="true" />
                {isEditing ? 'Cancel' : 'Edit profile'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Profile Completion Card */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Profile completion</h3>
            <p className="mt-1 text-sm text-foreground-muted">Complete your profile to get the most out of RicozAssist</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-foreground">{completionPercentage}%</span>
              <span className="text-sm text-foreground-muted">{completedCount}/{profileCompletion.length} completed</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <ul className="space-y-2">
            {profileCompletion.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.completed ? (
                  <Check className="h-4 w-4 text-success" aria-hidden="true" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-border" />
                )}
                <span className={item.completed ? 'text-foreground' : 'text-foreground-muted'}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Personal Details Card */}
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Personal details</h3>
            <p className="mt-1 text-sm text-foreground-muted">Update your personal information</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Input
                label="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Input
                label="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your last name"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                type="email"
                placeholder="your.email@example.com"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                placeholder="Tell us a little about yourself"
                rows={4}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-foreground placeholder:text-foreground-muted disabled:bg-muted disabled:text-foreground-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save changes
              </Button>
            </div>
          )}
        </Card>

        {/* Account Security Card */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Account security</h3>
            <p className="mt-1 text-sm text-foreground-muted">Manage your account security settings</p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Email verified</p>
                <p className="text-xs text-foreground-muted">{user?.email}</p>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                <Check className="h-4 w-4 text-success" />
              </div>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Account status</p>
                <p className="text-xs text-foreground-muted">Active</p>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                <Check className="h-4 w-4 text-success" />
              </div>
            </li>
          </ul>

          <Button 
            variant="secondary" 
            className="mt-6 w-full"
            onClick={() => window.location.href = '/security'}
          >
            <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
            Security settings
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

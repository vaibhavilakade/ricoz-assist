import { ReactNode } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  FileText,
  Layers3,
  Sparkles,
} from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  showLeftPanel?: boolean;
}

const Brand = ({ compact = false }: { compact?: boolean }) => (
  <div className={`auth-brand${compact ? ' auth-brand-compact' : ''}`}>
    <span className="auth-brand-mark" aria-hidden="true">
      R
    </span>
    <span className="auth-brand-name">RicozAssist</span>
  </div>
);

const WorkspacePreview = () => (
  <div className="workspace-preview" aria-label="A preview of the RicozAssist workspace">
    <div className="preview-window">
      <div className="preview-sidebar">
        <span className="preview-sidebar-mark">R</span>
        <span className="preview-sidebar-line preview-sidebar-line-active" />
        <span className="preview-sidebar-line" />
        <span className="preview-sidebar-line preview-sidebar-line-short" />
      </div>
      <div className="preview-content">
        <div className="preview-topline">
          <span>Workspace</span>
          <span className="preview-avatar">A</span>
        </div>
        <div className="preview-greeting">Good morning, Alex</div>
        <div className="preview-subtitle">Your team, in sync.</div>
        <div className="preview-items">
          <div className="preview-item">
            <span className="preview-item-icon preview-icon-blue"><FileText size={15} /></span>
            <span><strong>Project brief</strong><small>Updated just now</small></span>
            <ArrowUpRight className="preview-item-arrow" size={15} />
          </div>
          <div className="preview-item">
            <span className="preview-item-icon preview-icon-pink"><CalendarDays size={15} /></span>
            <span><strong>Team sync</strong><small>Today · 10:30 AM</small></span>
            <ArrowUpRight className="preview-item-arrow" size={15} />
          </div>
          <div className="preview-item">
            <span className="preview-item-icon preview-icon-violet"><Check size={15} /></span>
            <span><strong>Review launch plan</strong><small>Action item · Due today</small></span>
            <span className="preview-check"><Check size={12} /></span>
          </div>
        </div>
      </div>
    </div>
    <div className="preview-note">
      <span className="preview-note-icon"><Layers3 size={16} /></span>
      <span><strong>Everything in one place</strong><small>Less searching. More doing.</small></span>
    </div>
    <span className="preview-sparkle" aria-hidden="true"><Sparkles size={19} /></span>
  </div>
);

const AuthLayout = ({ children, showLeftPanel = true }: AuthLayoutProps) => (
  <main className="auth-page">
    <div className="auth-backdrop" aria-hidden="true">
      <span className="auth-glow auth-glow-blue" />
      <span className="auth-glow auth-glow-pink" />
      <span className="auth-glow auth-glow-violet" />
      <span className="auth-grid" />
    </div>

    <div className={`auth-layout${showLeftPanel ? '' : ' auth-layout-centered'}`}>
      {showLeftPanel && (
        <aside className="auth-story">
          <Brand />
          <div className="auth-story-copy">
            <div className="auth-eyebrow"><span /> Your team's workspace</div>
            <h1>Everything your team needs, <em>in one focused workspace.</em></h1>
            <p>
              Bring documents, meetings, action items and knowledge together in one
              organized workspace.
            </p>
            <WorkspacePreview />
          </div>
          <p className="auth-story-footer">A clearer way to work together <span>·</span> Built for your team</p>
        </aside>
      )}

      <section className="auth-main" aria-label="Account access">
        <div className="auth-mobile-header">
          <Brand compact />
          <div className="auth-mobile-art" aria-hidden="true">
            <span className="auth-mobile-orbit auth-mobile-orbit-one" />
            <span className="auth-mobile-orbit auth-mobile-orbit-two" />
            <span className="auth-mobile-art-icon"><Layers3 size={18} /></span>
            <span className="auth-mobile-art-dot" />
          </div>
        </div>
        <div className="auth-panel">
          <div className="auth-card-brand">
            <span className="auth-card-brand-mark" aria-hidden="true">R</span>
            <span>RicozAssist</span>
          </div>
          {children}
        </div>
        <p className="auth-footer">© {new Date().getFullYear()} RicozAssist <span>·</span> A clearer way to work together</p>
      </section>
    </div>
  </main>
);

export default AuthLayout;

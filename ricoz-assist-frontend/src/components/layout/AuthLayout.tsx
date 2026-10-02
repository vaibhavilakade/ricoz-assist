import { ReactNode } from 'react';
import { BookOpen, CalendarDays, CheckSquare, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <main className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <aside className="relative hidden overflow-hidden bg-gray-950 px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
      <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/5" aria-hidden="true" />
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-white/5" aria-hidden="true" />
      <div className="relative flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-bold text-white">
          R
        </span>
        <span className="text-lg font-semibold tracking-tight">RicozAssist</span>
      </div>

      <div className="relative max-w-xl py-16">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-200">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Your team's workspace
        </div>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
          Keep your work and knowledge in focus.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-gray-300">
          A shared place for documents, meetings, action items, and thoughtful AI-assisted queries.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Documents', Icon: BookOpen },
            { label: 'Meetings', Icon: CalendarDays },
            { label: 'Action items', Icon: CheckSquare },
          ].map(({ label, Icon }) => (
            <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-medium text-gray-200">
              <Icon className="h-4 w-4 text-indigo-300" aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
      </div>
      <p className="relative text-xs text-gray-500">RicozAssist · Team productivity workspace</p>
    </aside>

    <section className="flex min-w-0 flex-col items-center justify-center px-5 py-10 sm:px-8">
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">R</span>
        <span className="font-semibold tracking-tight text-gray-950">RicozAssist</span>
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-10 text-center text-xs text-gray-400">© RicozAssist · A clearer way to work together</p>
    </section>
  </main>
);

export default AuthLayout;

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
}

const PageHeader = ({ title, description, action, eyebrow }: PageHeaderProps) => (
  <div className="mb-8 flex flex-col gap-4 border-b border-gray-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {eyebrow && (
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-[1.875rem] sm:font-medium">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">{description}</p>
    </div>
    {action && <div className="flex shrink-0 items-center">{action}</div>}
  </div>
);

export default PageHeader;

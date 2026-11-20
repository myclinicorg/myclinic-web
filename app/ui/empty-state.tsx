import type { RemixiconComponentType } from '@remixicon/react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: RemixiconComponentType;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <span className="bg-brand-100 flex size-16 items-center justify-center rounded-full">
        <Icon aria-hidden className="text-brand-700 size-8" />
      </span>
      <div className="flex max-w-sm flex-col gap-2">
        <h2 className="text-heading-6 text-neutral-900">{title}</h2>
        <p className="text-body-m text-neutral-600">{description}</p>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

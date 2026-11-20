import type { RemixiconComponentType } from '@remixicon/react';
import clsx from 'clsx';
import { SkeletonLine } from '@/app/ui/skeletons';

export function StatGrid({
  children,
  columns = 4,
}: {
  children: React.ReactNode;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={clsx(
        'grid grid-cols-2 gap-3 sm:gap-6',
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: RemixiconComponentType;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 border border-neutral-100 bg-white p-4 sm:p-5">
      <span className="bg-brand-100 flex size-8 items-center justify-center rounded-full">
        <Icon aria-hidden className="text-brand-700 size-4" />
      </span>
      <p className="text-body-s text-neutral-600">{label}</p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-heading-4 sm:text-heading-3 truncate text-neutral-900">
          {value}
        </p>
        {hint}
      </div>
    </div>
  );
}

export function StatGridSkeleton({ count = 4 }: { count?: 3 | 4 }) {
  return (
    <StatGrid columns={count}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 border border-neutral-100 bg-white p-4 sm:p-5"
        >
          <div className="size-8 rounded-full bg-neutral-100" />
          <SkeletonLine className="w-1/2" />
          <div className="h-8 w-2/3 bg-neutral-100" />
        </div>
      ))}
    </StatGrid>
  );
}

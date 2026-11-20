import clsx from 'clsx';

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={clsx('h-3 bg-neutral-100', className)} />;
}

export function TextSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3">
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-11/12" />
      <SkeletonLine className="w-2/3" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border border-neutral-100 bg-white p-4">
      <div className="h-35 bg-neutral-100" />
      <SkeletonLine className="h-3.5 w-full" />
      <SkeletonLine className="w-2/3" />
      <SkeletonLine className="w-1/3" />
    </div>
  );
}

export function FormSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-10">
      <div className="flex flex-col gap-2 lg:w-70">
        <SkeletonLine className="h-4 w-1/2" />
        <SkeletonLine className="w-3/4" />
      </div>
      <div className="flex flex-1 flex-col gap-5 border border-neutral-100 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-10 bg-neutral-100" />
          <div className="h-10 bg-neutral-100" />
          <div className="h-10 bg-neutral-100" />
          <div className="h-10 bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

export function ClinicFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <FormSectionSkeleton />
      <FormSectionSkeleton />
      <FormSectionSkeleton />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      <div className="h-11 border-b border-neutral-100 bg-neutral-50" />
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex h-16 items-center gap-3 border-b border-neutral-100 px-4"
        >
          <div className="size-8 rounded-full bg-neutral-100" />
          <div className="flex flex-1 flex-col gap-2">
            <SkeletonLine className="w-1/3" />
            <SkeletonLine className="w-1/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

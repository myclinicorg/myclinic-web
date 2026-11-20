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

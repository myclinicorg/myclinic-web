import clsx from 'clsx';

export type TimelineEntry = {
  id: string;
  date: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  state?: 'done' | 'current' | 'upcoming';
};

const markers = {
  done: 'bg-brand-700',
  current: 'border-4 border-brand-700 bg-white',
  upcoming: 'bg-neutral-100',
};

export default function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <ol className="flex flex-col">
      {items.map((item, index) => {
        const state = item.state ?? 'done';
        const isLast = index === items.length - 1;
        return (
          <li key={item.id} className="flex gap-4">
            <div aria-hidden className="flex flex-col items-center gap-1">
              <span
                className={clsx('size-4 shrink-0 rounded-full', markers[state])}
              />
              {!isLast && (
                <span
                  className={clsx(
                    'w-0.5 flex-1',
                    state === 'done' ? 'bg-brand-700' : 'bg-neutral-100',
                  )}
                />
              )}
            </div>
            <div
              className={clsx(
                'flex min-w-0 flex-1 flex-col gap-1',
                !isLast && 'pb-6',
              )}
            >
              <p className="text-body-xs text-neutral-600">{item.date}</p>
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={clsx(
                    'text-subtitle-m',
                    state === 'upcoming'
                      ? 'text-neutral-600'
                      : 'text-neutral-900',
                  )}
                >
                  {item.title}
                </p>
                {item.badge}
              </div>
              {item.description && (
                <p className="text-body-s text-neutral-600">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

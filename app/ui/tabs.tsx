import clsx from 'clsx';
import Link from 'next/link';

export default function Tabs({
  label,
  tabs,
  current,
}: {
  label: string;
  tabs: { name: string; href: string; value: string; count?: number }[];
  current: string;
}) {
  return (
    <nav aria-label={label} className="flex gap-6 border-b border-neutral-100">
      {tabs.map((tab) => {
        const active = tab.value === current;
        return (
          <Link
            key={tab.value}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'text-button-m -mb-px flex items-center gap-2 border-b-2 px-1 py-3',
              active
                ? 'border-brand-700 text-brand-700'
                : 'border-transparent text-neutral-800 hover:text-neutral-900',
            )}
          >
            {tab.name}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'text-body-xs flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-normal tracking-normal text-white',
                  active ? 'bg-brand-700' : 'bg-neutral-700',
                )}
              >
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

import clsx from 'clsx';
import Link from 'next/link';

export default function Tabs({
  label,
  tabs,
  current,
}: {
  label: string;
  tabs: { name: string; href: string; value: string }[];
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
              'text-button-m -mb-px border-b-2 px-1 py-3',
              active
                ? 'border-brand-700 text-brand-700'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}

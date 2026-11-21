import clsx from 'clsx';
import Link from 'next/link';

export default function SegmentedControl({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string; active: boolean }[];
}) {
  return (
    <nav aria-label={label} className="flex gap-1 bg-neutral-100 p-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? 'page' : undefined}
          className={clsx(
            'text-button-s focus-visible:outline-brand-700 border px-3.5 py-1.5 focus-visible:outline-2',
            item.active
              ? 'border-neutral-200 bg-white text-neutral-900'
              : 'border-transparent text-neutral-600 hover:text-neutral-900',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

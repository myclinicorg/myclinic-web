import { RiArrowRightSLine } from '@remixicon/react';
import Link from 'next/link';

export function List({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col">{children}</ul>;
}

export function ListItem({
  href,
  leading,
  title,
  description,
  meta,
}: {
  href: string;
  leading?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  return (
    <li className="border-b border-neutral-100 last:border-b-0">
      <Link
        href={href}
        className="focus-visible:outline-brand-700 flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2"
      >
        {leading}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-subtitle-m truncate text-neutral-900">
            {title}
          </span>
          {description && (
            <span className="text-body-s truncate text-neutral-600">
              {description}
            </span>
          )}
        </div>
        {meta && (
          <span className="text-body-s shrink-0 text-neutral-600">{meta}</span>
        )}
        <RiArrowRightSLine
          aria-hidden
          className="size-5 shrink-0 text-neutral-600"
        />
      </Link>
    </li>
  );
}

import { RiArrowRightSLine } from '@remixicon/react';
import Link from 'next/link';

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Caminho">
      <ol className="text-body-s flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="text-brand-700 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-neutral-900">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <RiArrowRightSLine
                aria-hidden
                className="size-4 text-neutral-600"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

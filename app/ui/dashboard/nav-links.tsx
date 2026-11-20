'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActive, links } from '@/app/ui/dashboard/links';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.name}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'text-menu-m flex h-11 w-full items-center gap-3 px-3',
              active
                ? 'bg-brand-50 text-brand-700'
                : 'text-neutral-800 hover:bg-neutral-50',
            )}
          >
            <LinkIcon aria-hidden className="size-5 shrink-0" />
            <span className="truncate">{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}

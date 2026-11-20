import { RiArrowRightSLine } from '@remixicon/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { links } from '@/app/ui/dashboard/links';
import UserCard, { UserCardSkeleton } from '@/app/ui/dashboard/user-card';

export const metadata: Metadata = {
  title: 'Mais',
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white">
        <Suspense fallback={<UserCardSkeleton />}>
          <UserCard />
        </Suspense>
      </div>
      <nav aria-label="Seções" className="flex flex-col bg-white">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="text-menu-m flex h-12 items-center gap-3 border-b border-neutral-100 px-4 text-neutral-800 last:border-b-0"
            >
              <LinkIcon aria-hidden className="size-5 shrink-0" />
              <span className="flex-1">{link.name}</span>
              <RiArrowRightSLine
                aria-hidden
                className="size-5 text-neutral-500"
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

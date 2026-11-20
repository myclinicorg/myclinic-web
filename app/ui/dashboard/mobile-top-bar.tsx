'use client';

import { RiSettingsLine } from '@remixicon/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActive, links } from '@/app/ui/dashboard/links';

export default function MobileTopBar() {
  return <MobileTopBarView pathname={usePathname()} />;
}

export function MobileTopBarView({ pathname = '' }: { pathname?: string }) {
  const title =
    pathname === '/painel/mais'
      ? 'Mais'
      : (links.find((link) => isActive(pathname, link.href))?.name ??
        'MyClinic');

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-neutral-100 bg-white px-2 md:hidden">
      <p className="text-heading-6 flex-1 truncate pl-2 text-neutral-900">
        {title}
      </p>
      <Link
        href="/painel/clinica"
        aria-label="Clínica"
        className="flex size-10 items-center justify-center text-neutral-800"
      >
        <RiSettingsLine aria-hidden className="size-5" />
      </Link>
    </header>
  );
}

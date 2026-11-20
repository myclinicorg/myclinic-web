'use client';

import {
  RiCalendarLine,
  RiHomeLine,
  RiMoreLine,
  RiTeamLine,
  RiWallet3Line,
} from '@remixicon/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActive } from '@/app/ui/dashboard/links';

const tabs = [
  { name: 'Início', href: '/painel', icon: RiHomeLine },
  { name: 'Agenda', href: '/painel/agenda', icon: RiCalendarLine },
  { name: 'Pacientes', href: '/painel/pacientes', icon: RiTeamLine },
  { name: 'Caixa', href: '/painel/caixa', icon: RiWallet3Line },
  { name: 'Mais', href: '/painel/mais', icon: RiMoreLine },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-10 flex border-t border-neutral-100 bg-white px-2 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] md:hidden"
    >
      {tabs.map((tab) => {
        const TabIcon = tab.icon;
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'text-body-xxs flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2',
              active ? 'text-brand-700' : 'text-neutral-600',
            )}
          >
            <TabIcon aria-hidden className="size-6" />
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}

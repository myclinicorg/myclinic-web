import {
  RiArchiveLine,
  RiCalendarLine,
  RiDashboardLine,
  RiSettingsLine,
  RiStethoscopeLine,
  RiTeamLine,
  RiWallet3Line,
} from '@remixicon/react';

export const links = [
  { name: 'Visão geral', href: '/dashboard', icon: RiDashboardLine },
  { name: 'Agenda', href: '/dashboard/appointments', icon: RiCalendarLine },
  { name: 'Pacientes', href: '/dashboard/patients', icon: RiTeamLine },
  { name: 'Serviços', href: '/dashboard/services', icon: RiStethoscopeLine },
  { name: 'Estoque', href: '/dashboard/supplies', icon: RiArchiveLine },
  { name: 'Caixa', href: '/dashboard/transactions', icon: RiWallet3Line },
  { name: 'Clínica', href: '/dashboard/clinic', icon: RiSettingsLine },
];

export function isActive(pathname: string, href: string) {
  return href === '/dashboard'
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

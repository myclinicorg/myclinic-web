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
  { name: 'Visão geral', href: '/painel', icon: RiDashboardLine },
  { name: 'Agenda', href: '/painel/agenda', icon: RiCalendarLine },
  { name: 'Pacientes', href: '/painel/pacientes', icon: RiTeamLine },
  { name: 'Serviços', href: '/painel/servicos', icon: RiStethoscopeLine },
  { name: 'Estoque', href: '/painel/estoque', icon: RiArchiveLine },
  { name: 'Caixa', href: '/painel/caixa', icon: RiWallet3Line },
  { name: 'Clínica', href: '/painel/clinica', icon: RiSettingsLine },
];

export function isActive(pathname: string, href: string) {
  return href === '/painel'
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

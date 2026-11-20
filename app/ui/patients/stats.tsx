import {
  RiCalendarCheckLine,
  RiCalendarScheduleLine,
  RiTeamLine,
  RiUserUnfollowLine,
} from '@remixicon/react';
import { fetchPatientStats } from '@/app/lib/data';
import { StatCard, StatGrid } from '@/app/ui/stat-card';

export default async function PatientStats() {
  const stats = await fetchPatientStats();
  return (
    <StatGrid>
      <StatCard icon={RiTeamLine} label="Pacientes" value={stats.patients} />
      <StatCard
        icon={RiCalendarCheckLine}
        label="Atendidos no mês"
        value={stats.completedThisMonth}
      />
      <StatCard
        icon={RiCalendarScheduleLine}
        label="Agendados (7 dias)"
        value={stats.upcoming}
      />
      <StatCard
        icon={RiUserUnfollowLine}
        label="Faltas no mês"
        value={stats.noShowsThisMonth}
      />
    </StatGrid>
  );
}

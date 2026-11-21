import {
  RiCheckboxCircleLine,
  RiForbidLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
} from '@remixicon/react';
import { fetchServiceStats } from '@/app/lib/data';
import { formatCurrency, formatDuration } from '@/app/lib/utils';
import { StatCard, StatGrid } from '@/app/ui/stat-card';

export default async function ServiceStats() {
  const stats = await fetchServiceStats();
  return (
    <StatGrid>
      <StatCard
        icon={RiCheckboxCircleLine}
        label="Ativos"
        value={stats.active}
      />
      <StatCard icon={RiForbidLine} label="Inativos" value={stats.inactive} />
      <StatCard
        icon={RiMoneyDollarCircleLine}
        label="Preço médio"
        value={stats.active ? formatCurrency(stats.averagePriceCents) : '—'}
      />
      <StatCard
        icon={RiTimeLine}
        label="Duração média"
        value={stats.active ? formatDuration(stats.averageDuration) : '—'}
      />
    </StatGrid>
  );
}

import {
  RiAlertLine,
  RiArchiveLine,
  RiForbidLine,
  RiMoneyDollarCircleLine,
} from '@remixicon/react';
import { fetchStockStats } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import { StatCard, StatGrid } from '@/app/ui/stat-card';

export default async function StockStats() {
  const stats = await fetchStockStats();
  return (
    <StatGrid>
      <StatCard
        icon={RiArchiveLine}
        label="Insumos ativos"
        value={stats.active}
      />
      <StatCard icon={RiAlertLine} label="Abaixo do mínimo" value={stats.low} />
      <StatCard
        icon={RiMoneyDollarCircleLine}
        label="Valor em estoque"
        value={formatCurrency(stats.valueCents)}
      />
      <StatCard icon={RiForbidLine} label="Inativos" value={stats.inactive} />
    </StatGrid>
  );
}

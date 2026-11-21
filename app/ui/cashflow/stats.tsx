import {
  RiArrowDownCircleLine,
  RiArrowUpCircleLine,
  RiHourglassLine,
  RiScales3Line,
} from '@remixicon/react';
import { fetchCashflowSummary } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import { StatCard, StatGrid } from '@/app/ui/stat-card';

export default async function CashflowStats({ month }: { month: string }) {
  const summary = await fetchCashflowSummary(month);
  return (
    <StatGrid>
      <StatCard
        icon={RiArrowUpCircleLine}
        label="Recebido no mês"
        value={formatCurrency(summary.incomeCents)}
      />
      <StatCard
        icon={RiArrowDownCircleLine}
        label="Pago no mês"
        value={formatCurrency(summary.expenseCents)}
      />
      <StatCard
        icon={RiScales3Line}
        label="Saldo"
        value={formatCurrency(summary.balanceCents)}
      />
      <StatCard
        icon={RiHourglassLine}
        label="A receber (vence no mês)"
        value={formatCurrency(summary.pendingIncomeCents)}
      />
    </StatGrid>
  );
}

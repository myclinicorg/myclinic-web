import {
  RiAddLine,
  RiAlertLine,
  RiCalendarCheckLine,
  RiHourglassLine,
  RiMoneyDollarCircleLine,
} from '@remixicon/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { requireClinic } from '@/app/lib/dal';
import { fetchOverview } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import { buttonClasses } from '@/app/ui/button';
import LowStockList from '@/app/ui/overview/low-stock-list';
import RevenueChart from '@/app/ui/overview/revenue-chart';
import StatusBar from '@/app/ui/overview/status-bar';
import UpcomingList from '@/app/ui/overview/upcoming-list';
import PageHeader from '@/app/ui/page-header';
import { CardSkeleton, TextSkeleton } from '@/app/ui/skeletons';
import { StatCard, StatGrid, StatGridSkeleton } from '@/app/ui/stat-card';
import WidgetCard from '@/app/ui/widget-card';

export const metadata: Metadata = {
  title: 'Visão geral',
};

async function Welcome() {
  const user = await requireClinic();
  const [firstName] = user.name.split(' ');
  return (
    <PageHeader
      title="Visão geral"
      description={`Olá, ${firstName}. Este é o resumo da sua clínica.`}
      actions={
        <Link href="/painel/agenda/novo" className={buttonClasses()}>
          <RiAddLine aria-hidden />
          Novo agendamento
        </Link>
      }
    />
  );
}

async function Dashboard() {
  await requireClinic();
  const overview = await fetchOverview();
  const lastMonth = overview.revenue.at(-1)!;

  return (
    <>
      <StatGrid>
        <StatCard
          icon={RiCalendarCheckLine}
          label="Atendimentos hoje"
          value={overview.todayCount}
        />
        <StatCard
          icon={RiMoneyDollarCircleLine}
          label="Recebido no mês"
          value={formatCurrency(overview.incomeThisMonthCents)}
        />
        <StatCard
          icon={RiHourglassLine}
          label="A receber"
          value={formatCurrency(overview.pendingIncomeCents)}
        />
        <StatCard
          icon={RiAlertLine}
          label="Estoque baixo"
          value={overview.lowStockTotal}
        />
      </StatGrid>
      <div className="grid gap-6 lg:grid-cols-3">
        <WidgetCard
          title="Receitas e despesas"
          subtitle={`Últimos 6 meses · até ${lastMonth.month}/${lastMonth.year}`}
          className="lg:col-span-2"
        >
          <RevenueChart months={overview.revenue} />
        </WidgetCard>
        <WidgetCard title="Atendimentos do mês" subtitle="Por status">
          <StatusBar counts={overview.statusCounts} />
        </WidgetCard>
        <WidgetCard
          title="Próximos atendimentos"
          subtitle="Agendados e confirmados nos próximos 7 dias"
          className="lg:col-span-2"
          action={
            <Link
              href="/painel/agenda"
              className={buttonClasses({
                hierarchy: 'secondary',
                color: 'gray',
                size: 's',
              })}
            >
              Ver agenda
            </Link>
          }
        >
          <UpcomingList
            appointments={overview.upcoming}
            today={overview.today}
          />
        </WidgetCard>
        <WidgetCard
          title="Estoque baixo"
          subtitle="Insumos no mínimo ou abaixo"
          action={
            <Link
              href="/painel/estoque?situacao=baixo"
              className={buttonClasses({
                hierarchy: 'secondary',
                color: 'gray',
                size: 's',
              })}
            >
              Ver estoque
            </Link>
          }
        >
          <LowStockList supplies={overview.lowStock} />
        </WidgetCard>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<TextSkeleton />}>
        <Welcome />
      </Suspense>
      <Suspense
        fallback={
          <>
            <StatGridSkeleton />
            <CardSkeleton />
          </>
        }
      >
        <Dashboard />
      </Suspense>
    </div>
  );
}

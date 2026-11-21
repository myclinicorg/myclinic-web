import type { Metadata } from 'next';
import { Suspense } from 'react';
import { requireClinic } from '@/app/lib/dal';
import { fetchStockStats, type StockTab } from '@/app/lib/data';
import PageHeader from '@/app/ui/page-header';
import { SkeletonLine, TableSkeleton } from '@/app/ui/skeletons';
import { StatGridSkeleton } from '@/app/ui/stat-card';
import { CreateSupply } from '@/app/ui/stock/buttons';
import StockStats from '@/app/ui/stock/stats';
import SuppliesTable, { SuppliesCount } from '@/app/ui/stock/table';
import TableCard from '@/app/ui/table-card';
import Tabs from '@/app/ui/tabs';

export const metadata: Metadata = {
  title: 'Estoque',
};

const TITLES = {
  todos: 'Insumos ativos',
  baixo: 'Estoque baixo',
  inativos: 'Insumos inativos',
};

async function StockTabs({ current }: { current: StockTab }) {
  const stats = await fetchStockStats();
  return (
    <Tabs
      label="Situação"
      current={current}
      tabs={[
        {
          name: 'Ativos',
          href: '/painel/estoque',
          value: 'todos',
          count: stats.active,
        },
        {
          name: 'Estoque baixo',
          href: '/painel/estoque?situacao=baixo',
          value: 'baixo',
          count: stats.low,
        },
        {
          name: 'Inativos',
          href: '/painel/estoque?situacao=inativos',
          value: 'inativos',
          count: stats.inactive,
        },
      ]}
    />
  );
}

async function SuppliesList({
  searchParams,
}: {
  searchParams: PageProps<'/painel/estoque'>['searchParams'];
}) {
  await requireClinic();
  const params = await searchParams;
  const tab: StockTab =
    params.situacao === 'baixo' || params.situacao === 'inativos'
      ? params.situacao
      : 'todos';
  const currentPage = Number(params.page) || 1;
  const key = `${tab}|${currentPage}`;

  return (
    <>
      <StockTabs current={tab} />
      <TableCard
        title={TITLES[tab]}
        subtitle={
          <Suspense key={key} fallback="Carregando…">
            <SuppliesCount tab={tab} currentPage={currentPage} />
          </Suspense>
        }
        actions={
          <div className="hidden md:block">
            <CreateSupply size="s" />
          </div>
        }
      >
        <Suspense key={key} fallback={<TableSkeleton />}>
          <SuppliesTable tab={tab} currentPage={currentPage} />
        </Suspense>
      </TableCard>
    </>
  );
}

export default function Page(props: PageProps<'/painel/estoque'>) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Estoque"
        description="Insumos, níveis mínimos e movimentações."
        actions={
          <div className="md:hidden">
            <CreateSupply />
          </div>
        }
      />
      <Suspense fallback={<StatGridSkeleton />}>
        <StockStats />
      </Suspense>
      <Suspense
        fallback={
          <div className="border border-neutral-100 bg-white p-5">
            <SkeletonLine className="w-40" />
          </div>
        }
      >
        <SuppliesList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

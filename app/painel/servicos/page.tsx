import type { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchServiceStats } from '@/app/lib/data';
import PageHeader from '@/app/ui/page-header';
import { CreateService } from '@/app/ui/services/buttons';
import ServiceStats from '@/app/ui/services/stats';
import ServicesTable, { ServicesCount } from '@/app/ui/services/table';
import { StatGridSkeleton } from '@/app/ui/stat-card';
import { SkeletonLine, TableSkeleton } from '@/app/ui/skeletons';
import TableCard from '@/app/ui/table-card';
import Tabs from '@/app/ui/tabs';

export const metadata: Metadata = {
  title: 'Serviços',
};

const titles = {
  todos: 'Todos os serviços',
  ativos: 'Serviços ativos',
  inativos: 'Serviços inativos',
};

async function StatusTabs({ current }: { current: keyof typeof titles }) {
  const stats = await fetchServiceStats();
  return (
    <Tabs
      label="Status"
      current={current}
      tabs={[
        {
          name: 'Todos',
          href: '/painel/servicos',
          value: 'todos',
          count: stats.active + stats.inactive,
        },
        {
          name: 'Ativos',
          href: '/painel/servicos?status=ativos',
          value: 'ativos',
          count: stats.active,
        },
        {
          name: 'Inativos',
          href: '/painel/servicos?status=inativos',
          value: 'inativos',
          count: stats.inactive,
        },
      ]}
    />
  );
}

async function ServicesList({
  searchParams,
}: {
  searchParams: PageProps<'/painel/servicos'>['searchParams'];
}) {
  const params = await searchParams;
  const status =
    params.status === 'ativos' || params.status === 'inativos'
      ? params.status
      : undefined;
  const currentPage = Number(params.page) || 1;
  const key = `${status}|${currentPage}`;

  return (
    <>
      <StatusTabs current={status ?? 'todos'} />
      <TableCard
        title={titles[status ?? 'todos']}
        subtitle={
          <Suspense key={key} fallback="Carregando…">
            <ServicesCount status={status} currentPage={currentPage} />
          </Suspense>
        }
        actions={
          <div className="hidden md:block">
            <CreateService size="s" />
          </div>
        }
      >
        <Suspense key={key} fallback={<TableSkeleton />}>
          <ServicesTable status={status} currentPage={currentPage} />
        </Suspense>
      </TableCard>
    </>
  );
}

export default function Page(props: PageProps<'/painel/servicos'>) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Serviços"
        description="O que você oferece, com preço e duração."
        actions={
          <div className="md:hidden">
            <CreateService />
          </div>
        }
      />
      <Suspense fallback={<StatGridSkeleton />}>
        <ServiceStats />
      </Suspense>
      <Suspense
        fallback={
          <div className="border border-neutral-100 bg-white p-5">
            <SkeletonLine className="w-40" />
          </div>
        }
      >
        <ServicesList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

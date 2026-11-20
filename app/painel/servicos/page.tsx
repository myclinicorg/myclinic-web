import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageHeader from '@/app/ui/page-header';
import { CreateService } from '@/app/ui/services/buttons';
import ServicesTable from '@/app/ui/services/table';
import { TableSkeleton } from '@/app/ui/skeletons';
import Tabs from '@/app/ui/tabs';

export const metadata: Metadata = {
  title: 'Serviços',
};

const statusTabs = [
  { name: 'Todos', href: '/painel/servicos', value: 'todos' },
  { name: 'Ativos', href: '/painel/servicos?status=ativos', value: 'ativos' },
  {
    name: 'Inativos',
    href: '/painel/servicos?status=inativos',
    value: 'inativos',
  },
];

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

  return (
    <>
      <Tabs label="Status" tabs={statusTabs} current={status ?? 'todos'} />
      <div className="border border-neutral-100 bg-white">
        <Suspense key={`${status}${currentPage}`} fallback={<TableSkeleton />}>
          <ServicesTable status={status} currentPage={currentPage} />
        </Suspense>
      </div>
    </>
  );
}

export default function Page(props: PageProps<'/painel/servicos'>) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Serviços"
        description="O que você oferece, com preço e duração."
        actions={<CreateService />}
      />
      <Suspense fallback={<TableSkeleton />}>
        <ServicesList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

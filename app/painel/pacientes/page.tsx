import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageHeader from '@/app/ui/page-header';
import { CreatePatient } from '@/app/ui/patients/buttons';
import PatientStats from '@/app/ui/patients/stats';
import PatientsTable, { PatientsCount } from '@/app/ui/patients/table';
import Search from '@/app/ui/search';
import { StatGridSkeleton } from '@/app/ui/stat-card';
import { SkeletonLine, TableSkeleton } from '@/app/ui/skeletons';
import TableCard from '@/app/ui/table-card';

export const metadata: Metadata = {
  title: 'Pacientes',
};

async function PatientsList({
  searchParams,
}: {
  searchParams: PageProps<'/painel/pacientes'>['searchParams'];
}) {
  const { query, page } = await searchParams;
  const term = typeof query === 'string' ? query : '';
  const currentPage = Number(page) || 1;
  const key = `${term}|${currentPage}`;

  return (
    <TableCard
      title="Todos os pacientes"
      subtitle={
        <Suspense key={key} fallback="Carregando…">
          <PatientsCount query={term} currentPage={currentPage} />
        </Suspense>
      }
      actions={
        <>
          <div className="w-full sm:w-60">
            <Search placeholder="Buscar por nome ou CPF…" />
          </div>
          <div className="hidden md:block">
            <CreatePatient size="s" />
          </div>
        </>
      }
    >
      <Suspense key={key} fallback={<TableSkeleton />}>
        <PatientsTable query={term} currentPage={currentPage} />
      </Suspense>
    </TableCard>
  );
}

export default function Page(props: PageProps<'/painel/pacientes'>) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pacientes"
        description="Cadastro, contato e histórico dos seus pacientes."
        actions={
          <div className="md:hidden">
            <CreatePatient />
          </div>
        }
      />
      <Suspense fallback={<StatGridSkeleton />}>
        <PatientStats />
      </Suspense>
      <Suspense
        fallback={
          <div className="border border-neutral-100 bg-white p-5">
            <SkeletonLine className="w-40" />
          </div>
        }
      >
        <PatientsList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

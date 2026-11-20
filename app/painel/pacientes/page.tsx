import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageHeader from '@/app/ui/page-header';
import { CreatePatient } from '@/app/ui/patients/buttons';
import PatientsTable from '@/app/ui/patients/table';
import Search from '@/app/ui/search';
import { TableSkeleton } from '@/app/ui/skeletons';

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

  return (
    <>
      <Toolbar />
      <Suspense key={term + currentPage} fallback={<TableSkeleton />}>
        <PatientsTable query={term} currentPage={currentPage} />
      </Suspense>
    </>
  );
}

function Toolbar() {
  return (
    <div className="flex border-b border-neutral-100 py-4 pr-4 pl-5">
      <div className="w-full sm:w-80">
        <Search placeholder="Buscar por nome ou CPF…" />
      </div>
    </div>
  );
}

export default function Page(props: PageProps<'/painel/pacientes'>) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pacientes"
        description="Cadastro e contato dos seus pacientes."
        actions={<CreatePatient />}
      />
      <div className="border border-neutral-100 bg-white">
        <Suspense fallback={<TableSkeleton />}>
          <PatientsList searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

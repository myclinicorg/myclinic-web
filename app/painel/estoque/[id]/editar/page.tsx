import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchSupplyById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import PageHeader from '@/app/ui/page-header';
import { ClinicFormSkeleton } from '@/app/ui/skeletons';
import SupplyForm from '@/app/ui/stock/supply-form';

export const metadata: Metadata = {
  title: 'Editar insumo',
};

async function EditSupply({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supply = await fetchSupplyById(id);
  if (!supply) {
    notFound();
  }
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Estoque', href: '/painel/estoque' },
          { label: supply.name, href: `/painel/estoque/${supply.id}` },
          { label: 'Editar' },
        ]}
      />
      <PageHeader title="Editar insumo" description={supply.name} />
      <SupplyForm supply={supply} />
    </>
  );
}

export default function Page(props: PageProps<'/painel/estoque/[id]/editar'>) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<ClinicFormSkeleton />}>
        <EditSupply params={props.params} />
      </Suspense>
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchSupplyById, fetchSupplyMovements } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { CardSkeleton } from '@/app/ui/skeletons';
import MovementForm from '@/app/ui/stock/movement-form';
import {
  SupplyHeader,
  SupplyLevel,
  SupplyMovements,
} from '@/app/ui/stock/supply-detail';

export const metadata: Metadata = {
  title: 'Insumo',
};

async function SupplyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supply = await fetchSupplyById(id);
  if (!supply) {
    notFound();
  }
  const movements = await fetchSupplyMovements(id);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Estoque', href: '/painel/estoque' },
          { label: supply.name },
        ]}
      />
      <SupplyHeader supply={supply} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start">
        <div className="flex flex-col gap-6">
          <SupplyLevel supply={supply} />
          <SupplyMovements
            movements={movements.data}
            total={movements.meta.total}
            unit={supply.unit}
          />
        </div>
        <MovementForm key={supply.currentQuantity} supply={supply} />
      </div>
    </>
  );
}

export default function Page(props: PageProps<'/painel/estoque/[id]'>) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<CardSkeleton />}>
        <SupplyDetails params={props.params} />
      </Suspense>
    </div>
  );
}

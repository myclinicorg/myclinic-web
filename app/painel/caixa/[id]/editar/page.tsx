import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { currentDay, fetchTransactionById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import TransactionForm from '@/app/ui/cashflow/transaction-form';
import PageHeader from '@/app/ui/page-header';
import { ClinicFormSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Editar lançamento',
};

async function EditTransaction({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await fetchTransactionById(id);
  if (!transaction || transaction.status === 'CANCELED') {
    notFound();
  }
  return (
    <TransactionForm today={await currentDay()} transaction={transaction} />
  );
}

export default function Page(props: PageProps<'/painel/caixa/[id]/editar'>) {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: 'Caixa', href: '/painel/caixa' },
          { label: 'Editar lançamento' },
        ]}
      />
      <PageHeader
        title="Editar lançamento"
        description="Categoria, descrição, valor e vencimento."
      />
      <Suspense fallback={<ClinicFormSkeleton />}>
        <EditTransaction params={props.params} />
      </Suspense>
    </div>
  );
}

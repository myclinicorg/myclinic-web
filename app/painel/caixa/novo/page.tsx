import type { Metadata } from 'next';
import { Suspense } from 'react';
import { requireClinic } from '@/app/lib/dal';
import { currentDay } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import TransactionForm from '@/app/ui/cashflow/transaction-form';
import PageHeader from '@/app/ui/page-header';
import { ClinicFormSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Novo lançamento',
};

async function NewTransaction() {
  await requireClinic();
  return <TransactionForm today={await currentDay()} />;
}

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: 'Caixa', href: '/painel/caixa' },
          { label: 'Novo lançamento' },
        ]}
      />
      <PageHeader
        title="Novo lançamento"
        description="Registre uma receita ou despesa da clínica."
      />
      <Suspense fallback={<ClinicFormSkeleton />}>
        <NewTransaction />
      </Suspense>
    </div>
  );
}

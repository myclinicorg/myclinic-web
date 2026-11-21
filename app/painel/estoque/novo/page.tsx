import type { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import PageHeader from '@/app/ui/page-header';
import SupplyForm from '@/app/ui/stock/supply-form';

export const metadata: Metadata = {
  title: 'Novo insumo',
};

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: 'Estoque', href: '/painel/estoque' },
          { label: 'Novo insumo' },
        ]}
      />
      <PageHeader
        title="Novo insumo"
        description="Cadastre um material para acompanhar o estoque."
      />
      <SupplyForm />
    </div>
  );
}

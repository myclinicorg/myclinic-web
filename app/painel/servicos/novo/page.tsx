import type { Metadata } from 'next';
import PageHeader from '@/app/ui/page-header';
import ServiceForm from '@/app/ui/services/service-form';

export const metadata: Metadata = {
  title: 'Novo serviço',
};

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Novo serviço"
        description="Nome, preço e duração são obrigatórios."
      />
      <ServiceForm />
    </div>
  );
}

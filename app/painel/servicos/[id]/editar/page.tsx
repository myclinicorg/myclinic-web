import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchServiceById } from '@/app/lib/data';
import PageHeader from '@/app/ui/page-header';
import ServiceForm from '@/app/ui/services/service-form';
import { ClinicFormSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Editar serviço',
};

async function EditService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await fetchServiceById(id);
  if (!service) {
    notFound();
  }
  return <ServiceForm service={service} />;
}

export default function Page(props: PageProps<'/painel/servicos/[id]/editar'>) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Editar serviço"
        description="Para tirar um serviço da agenda sem perder o histórico, desative-o."
      />
      <Suspense fallback={<ClinicFormSkeleton />}>
        <EditService params={props.params} />
      </Suspense>
    </div>
  );
}

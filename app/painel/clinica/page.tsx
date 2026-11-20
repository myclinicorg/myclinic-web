import { RiInformationLine } from '@remixicon/react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCurrentUser } from '@/app/lib/dal';
import { fetchClinic } from '@/app/lib/data';
import ClinicForm from '@/app/ui/clinic/clinic-form';
import PageHeader from '@/app/ui/page-header';
import { ClinicFormSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Clínica',
};

async function ClinicContent() {
  const user = await getCurrentUser();

  if (!user.clinicId) {
    return (
      <>
        <div
          role="status"
          className="border-brand-200 bg-brand-50 text-body-s text-brand-900 flex items-start gap-3 border p-4"
        >
          <RiInformationLine aria-hidden className="size-5 shrink-0" />
          <p>
            Cadastre sua clínica para liberar a agenda, os pacientes, o estoque
            e o caixa.
          </p>
        </div>
        <ClinicForm />
      </>
    );
  }

  const clinic = await fetchClinic();
  return <ClinicForm clinic={clinic} />;
}

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clínica"
        description="Dados, endereço e expediente da sua clínica."
      />
      <Suspense fallback={<ClinicFormSkeleton />}>
        <ClinicContent />
      </Suspense>
    </div>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCurrentUser } from '@/app/lib/dal';
import { fetchClinic } from '@/app/lib/data';
import {
  ClinicSettingsForm,
  ClinicSetupForm,
} from '@/app/ui/clinic/clinic-form';
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
        <PageHeader
          title="Cadastre sua clínica"
          description="Leva uns dois minutos e libera a agenda, os pacientes, o estoque e o caixa. Você pode alterar tudo depois."
        />
        <ClinicSetupForm />
      </>
    );
  }

  const clinic = await fetchClinic();
  return (
    <>
      <PageHeader
        title="Clínica"
        description="Dados, endereço e expediente da sua clínica."
      />
      <ClinicSettingsForm clinic={clinic} />
    </>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<ClinicFormSkeleton />}>
        <ClinicContent />
      </Suspense>
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchPatientById } from '@/app/lib/data';
import PageHeader from '@/app/ui/page-header';
import PatientForm from '@/app/ui/patients/patient-form';
import { ClinicFormSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Editar paciente',
};

async function EditPatient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await fetchPatientById(id);
  if (!patient) {
    notFound();
  }
  return <PatientForm patient={patient} />;
}

export default function Page(
  props: PageProps<'/painel/pacientes/[id]/editar'>,
) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Editar paciente"
        description="Atualize os dados do paciente."
      />
      <Suspense fallback={<ClinicFormSkeleton />}>
        <EditPatient params={props.params} />
      </Suspense>
    </div>
  );
}

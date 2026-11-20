import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchPatientAppointments, fetchPatientById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  PatientAbout,
  PatientHeader,
  PatientHistory,
} from '@/app/ui/patients/patient-profile';
import { CardSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Paciente',
};

async function PatientDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await fetchPatientById(id);
  if (!patient) {
    notFound();
  }
  const appointments = await fetchPatientAppointments(id);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Pacientes', href: '/painel/pacientes' },
          { label: patient.fullName },
        ]}
      />
      <PatientHeader patient={patient} appointments={appointments} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <PatientAbout patient={patient} />
        <PatientHistory appointments={appointments} />
      </div>
    </>
  );
}

export default function Page(props: PageProps<'/painel/pacientes/[id]'>) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<CardSkeleton />}>
        <PatientDetails params={props.params} />
      </Suspense>
    </div>
  );
}

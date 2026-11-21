import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchAppointmentById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  AppointmentHeader,
  AppointmentInfo,
} from '@/app/ui/schedule/appointment-detail';
import { CardSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Atendimento',
};

async function AppointmentDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await fetchAppointmentById(id);
  if (!appointment) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Agenda', href: '/painel/agenda' },
          { label: appointment.patient.fullName },
        ]}
      />
      <AppointmentHeader appointment={appointment} />
      <AppointmentInfo appointment={appointment} />
    </>
  );
}

export default function Page(props: PageProps<'/painel/agenda/[id]'>) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<CardSkeleton />}>
        <AppointmentDetails params={props.params} />
      </Suspense>
    </div>
  );
}

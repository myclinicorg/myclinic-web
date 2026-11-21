import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { fetchAppointmentById } from '@/app/lib/data';
import { localDay, longDate, timeRange } from '@/app/lib/schedule';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import PageHeader from '@/app/ui/page-header';
import CompleteForm from '@/app/ui/schedule/complete-form';
import { CardSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Concluir atendimento',
};

async function Complete({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointment = await fetchAppointmentById(id);
  if (!appointment) {
    notFound();
  }
  if (
    appointment.status !== 'SCHEDULED' &&
    appointment.status !== 'CONFIRMED'
  ) {
    redirect(`/painel/agenda/${id}`);
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Agenda', href: '/painel/agenda' },
          {
            label: appointment.patient.fullName,
            href: `/painel/agenda/${id}`,
          },
          { label: 'Concluir' },
        ]}
      />
      <PageHeader
        title="Concluir atendimento"
        description={`${appointment.patient.fullName} · ${longDate(localDay(appointment.startsAt))}, ${timeRange(appointment.startsAt, appointment.endsAt)}`}
      />
      <CompleteForm appointment={appointment} />
    </>
  );
}

export default function Page(props: PageProps<'/painel/agenda/[id]/concluir'>) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<CardSkeleton />}>
        <Complete params={props.params} />
      </Suspense>
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { requireClinic } from '@/app/lib/dal';
import { fetchRescheduleOptions } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import PageHeader from '@/app/ui/page-header';
import RescheduleForm from '@/app/ui/schedule/reschedule-form';
import { ClinicFormSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Remarcar atendimento',
};

async function Reschedule({ params }: { params: Promise<{ id: string }> }) {
  await requireClinic();
  const { id } = await params;
  const { appointment, rules } = await fetchRescheduleOptions(id);
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
          { label: 'Remarcar' },
        ]}
      />
      <PageHeader
        title="Remarcar atendimento"
        description="Escolha um novo dia e horário. A duração do atendimento é mantida."
      />
      <RescheduleForm appointment={appointment} rules={rules} />
    </>
  );
}

export default function Page(props: PageProps<'/painel/agenda/[id]/remarcar'>) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<ClinicFormSkeleton />}>
        <Reschedule params={props.params} />
      </Suspense>
    </div>
  );
}

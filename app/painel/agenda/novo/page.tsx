import type { Metadata } from 'next';
import { Suspense } from 'react';
import { requireClinic } from '@/app/lib/dal';
import { fetchBookingOptions } from '@/app/lib/data';
import { isValidDay } from '@/app/lib/schedule';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import PageHeader from '@/app/ui/page-header';
import BookingForm from '@/app/ui/schedule/booking-form';
import { ClinicFormSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Novo agendamento',
};

async function Booking({
  searchParams,
}: {
  searchParams: PageProps<'/painel/agenda/novo'>['searchParams'];
}) {
  await requireClinic();
  const params = await searchParams;
  const { rules, patients, services } = await fetchBookingOptions();

  return (
    <BookingForm
      patients={patients}
      services={services}
      initialPatientId={
        typeof params.paciente === 'string' ? params.paciente : undefined
      }
      initialDay={
        isValidDay(params.data) &&
        params.data >= rules.today &&
        params.data <= rules.lastDay
          ? params.data
          : undefined
      }
      rules={rules}
    />
  );
}

export default function Page(props: PageProps<'/painel/agenda/novo'>) {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: 'Agenda', href: '/painel/agenda' },
          { label: 'Novo agendamento' },
        ]}
      />
      <PageHeader
        title="Novo agendamento"
        description="Escolha o paciente, o serviço e um horário livre."
      />
      <Suspense fallback={<ClinicFormSkeleton />}>
        <Booking searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

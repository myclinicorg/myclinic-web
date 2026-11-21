import {
  RiCalendarLine,
  RiCheckLine,
  RiMoneyDollarCircleLine,
  RiUserLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import clsx from 'clsx';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchAppointmentById } from '@/app/lib/data';
import { localDay, longDate, timeRange } from '@/app/lib/schedule';
import { formatCurrency } from '@/app/lib/utils';
import { buttonClasses } from '@/app/ui/button';
import { scheduleHref } from '@/app/ui/schedule/calendar-toolbar';
import { CardSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Atendimento agendado',
};

function Row({
  icon: Icon,
  title,
  description,
}: {
  icon: RemixiconComponentType;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-center gap-4 border-b border-neutral-100 py-4 last:border-b-0">
      <span className="bg-brand-100 flex size-8 shrink-0 items-center justify-center rounded-full">
        <Icon aria-hidden className="text-brand-700 size-4" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-subtitle-m text-neutral-900">{title}</span>
        <span className="text-body-s text-neutral-600">{description}</span>
      </span>
    </li>
  );
}

async function Confirmation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointment = await fetchAppointmentById(id);
  if (!appointment) {
    notFound();
  }
  const day = localDay(appointment.startsAt);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 py-8 text-center">
      <span className="bg-brand-100 flex size-16 items-center justify-center rounded-full">
        <RiCheckLine aria-hidden className="text-brand-700 size-8" />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-3 text-neutral-900">
          Atendimento agendado!
        </h1>
        <p className="text-body-m text-neutral-600">
          {appointment.patient.fullName} está na agenda de {longDate(day)}.
        </p>
      </div>
      <ul className="w-full border border-neutral-100 bg-white px-6 py-2 text-left">
        <Row
          icon={RiCalendarLine}
          title={longDate(day)}
          description={`${timeRange(appointment.startsAt, appointment.endsAt)} · ${appointment.service.name}`}
        />
        <Row
          icon={RiUserLine}
          title={appointment.patient.fullName}
          description="Paciente"
        />
        <Row
          icon={RiMoneyDollarCircleLine}
          title={formatCurrency(appointment.priceCents)}
          description="Cobrado ao concluir o atendimento"
        />
      </ul>
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Link
          href="/painel/agenda/novo"
          className={clsx(
            buttonClasses({ hierarchy: 'secondary', color: 'gray', size: 'l' }),
            'flex-1',
          )}
        >
          Novo agendamento
        </Link>
        <Link
          href={scheduleHref('semana', day)}
          className={clsx(buttonClasses({ size: 'l' }), 'flex-1')}
        >
          Ver na agenda
        </Link>
      </div>
      <Link
        href={`/painel/agenda/${appointment.id}`}
        className="text-body-s text-brand-700 hover:underline"
      >
        Ver detalhes do atendimento
      </Link>
    </div>
  );
}

export default function Page(props: PageProps<'/painel/agenda/[id]/agendado'>) {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <Confirmation params={props.params} />
    </Suspense>
  );
}

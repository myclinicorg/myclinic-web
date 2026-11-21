import {
  RiCalendarCheckLine,
  RiCalendarLine,
  RiEditLine,
  RiIdCardLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
} from '@remixicon/react';
import Link from 'next/link';
import type { PatientAppointment } from '@/app/lib/data';
import { APPOINTMENT_STATUS, type Patient } from '@/app/lib/definitions';
import {
  ageFrom,
  formatCpf,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhone,
  formatZipCode,
} from '@/app/lib/utils';
import Avatar from '@/app/ui/avatar';
import { Badge } from '@/app/ui/badge';
import { buttonClasses } from '@/app/ui/button';
import { DeletePatient } from '@/app/ui/patients/buttons';
import Timeline, { type TimelineEntry } from '@/app/ui/timeline';

function address(patient: Patient) {
  const line = [patient.street, patient.streetNumber, patient.addressComplement]
    .filter(Boolean)
    .join(', ');
  const place = [patient.neighborhood, patient.city, patient.state]
    .filter(Boolean)
    .join(' · ');
  const zip = patient.zipCode ? `CEP ${formatZipCode(patient.zipCode)}` : '';
  return [line, place, zip].filter(Boolean).join(' — ') || null;
}

export function PatientHeader({
  patient,
  appointments,
}: {
  patient: Patient;
  appointments: PatientAppointment[];
}) {
  const completed = appointments.filter((a) => a.status === 'COMPLETED');
  const noShows = appointments.filter((a) => a.status === 'NO_SHOW').length;
  const next = appointments
    .filter(
      (a) =>
        (a.status === 'SCHEDULED' || a.status === 'CONFIRMED') && a.isUpcoming,
    )
    .at(-1);
  const meta = [
    patient.dateOfBirth ? `${ageFrom(patient.dateOfBirth)} anos` : null,
    patient.sex,
    `CPF ${formatCpf(patient.cpf)}`,
  ].filter(Boolean);

  const stats = [
    { label: 'Atendimentos', value: completed.length },
    { label: 'Faltas', value: noShows },
    {
      label: 'Próximo atendimento',
      value: next ? formatDateTime(next.startsAt) : '—',
    },
  ];

  return (
    <section className="flex flex-col gap-6 border border-neutral-100 bg-white p-6 md:px-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-5">
          <Avatar name={patient.fullName} size="l" />
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-heading-4 truncate text-neutral-900">
              {patient.fullName}
            </h1>
            <p className="text-body-m text-neutral-600">{meta.join(' · ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DeletePatient
            id={patient.id}
            name={patient.fullName}
            redirectTo="/painel/pacientes"
          />
          <Link
            href={`/painel/pacientes/${patient.id}/editar`}
            className={buttonClasses({ hierarchy: 'secondary', color: 'gray' })}
          >
            <RiEditLine aria-hidden />
            Editar
          </Link>
        </div>
      </div>
      <dl className="flex flex-wrap gap-x-8 gap-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-0.5">
            <dt className="text-body-s text-neutral-600">{stat.label}</dt>
            <dd className="text-subtitle-m text-neutral-900">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof RiPhoneLine;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="bg-brand-100 flex size-8 shrink-0 items-center justify-center rounded-full">
        <Icon aria-hidden className="text-brand-700 size-4" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-body-xs text-neutral-600">{label}</span>
        <span className="text-body-m break-words text-neutral-900">
          {children}
        </span>
      </div>
    </div>
  );
}

export function PatientAbout({ patient }: { patient: Patient }) {
  const fullAddress = address(patient);
  return (
    <section className="flex flex-col gap-5 border border-neutral-100 bg-white p-6">
      <h2 className="text-subtitle-m text-neutral-900">Sobre</h2>
      {patient.notes ? (
        <p className="text-body-m whitespace-pre-line text-neutral-800">
          {patient.notes}
        </p>
      ) : (
        <p className="text-body-s text-neutral-600">Sem observações.</p>
      )}
      <div className="flex flex-col gap-4">
        <InfoRow icon={RiPhoneLine} label="Telefone">
          {patient.phone ? formatPhone(patient.phone) : '—'}
        </InfoRow>
        <InfoRow icon={RiMailLine} label="E-mail">
          {patient.email ?? '—'}
        </InfoRow>
        <InfoRow icon={RiCalendarLine} label="Nascimento">
          {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : '—'}
        </InfoRow>
        <InfoRow icon={RiIdCardLine} label="CPF">
          {formatCpf(patient.cpf)}
        </InfoRow>
        <InfoRow icon={RiMapPinLine} label="Endereço">
          {fullAddress ?? '—'}
        </InfoRow>
      </div>
    </section>
  );
}

export function PatientHistory({
  appointments,
}: {
  appointments: PatientAppointment[];
}) {
  const firstPast = appointments.findIndex((a) => !a.isUpcoming);
  const items: TimelineEntry[] = appointments.map((appointment, index) => {
    const status = APPOINTMENT_STATUS[appointment.status];
    return {
      id: appointment.id,
      date: formatDateTime(appointment.startsAt),
      title: appointment.service.name,
      description: formatCurrency(appointment.priceCents),
      badge: (
        <Badge color={status.color} size="s" dot>
          {status.label}
        </Badge>
      ),
      state:
        firstPast === -1 || index < firstPast
          ? 'upcoming'
          : index === firstPast
            ? 'current'
            : 'done',
    };
  });

  return (
    <section className="flex flex-col gap-5 border border-neutral-100 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-subtitle-m text-neutral-900">
          Histórico de atendimentos
        </h2>
        <span className="text-body-s text-neutral-600">
          {appointments.length}{' '}
          {appointments.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>
      {items.length ? (
        <Timeline items={items} />
      ) : (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="bg-brand-100 flex size-12 items-center justify-center rounded-full">
            <RiCalendarCheckLine
              aria-hidden
              className="text-brand-700 size-6"
            />
          </span>
          <p className="text-body-m text-neutral-600">
            Nenhum atendimento ainda.
          </p>
        </div>
      )}
    </section>
  );
}

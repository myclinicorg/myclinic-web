import {
  RiArrowRightSLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import Link from 'next/link';
import {
  APPOINTMENT_STATUS,
  type AppointmentDetail,
  PAYMENT_METHODS,
} from '@/app/lib/definitions';
import {
  dayAndMonth,
  localDay,
  localMinutes,
  longDate,
  timeRange,
  weekdayAndYear,
} from '@/app/lib/schedule';
import {
  formatCurrency,
  formatDateTime,
  formatDuration,
} from '@/app/lib/utils';
import Avatar from '@/app/ui/avatar';
import { Badge } from '@/app/ui/badge';
import AppointmentActions from '@/app/ui/schedule/appointment-actions';

function InfoTile({
  icon: Icon,
  title,
  description,
}: {
  icon: RemixiconComponentType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 bg-neutral-50 p-3">
      <span className="bg-brand-100 flex size-8 items-center justify-center">
        <Icon aria-hidden className="text-brand-700 size-5" />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-subtitle-m text-neutral-900">{title}</p>
        <p className="text-body-s text-neutral-600">{description}</p>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <dt className="text-body-s text-neutral-600 sm:w-40 sm:shrink-0">
        {label}
      </dt>
      <dd className="text-body-s text-neutral-900">{children}</dd>
    </div>
  );
}

export function AppointmentHeader({
  appointment,
}: {
  appointment: AppointmentDetail;
}) {
  const status = APPOINTMENT_STATUS[appointment.status];
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-heading-4 text-neutral-900">
            {appointment.service.name}
          </h1>
          <Badge color={status.color} dot>
            {status.label}
          </Badge>
        </div>
        <p className="text-body-m text-neutral-600">
          {appointment.patient.fullName} ·{' '}
          {longDate(localDay(appointment.startsAt))},{' '}
          {timeRange(appointment.startsAt, appointment.endsAt)}
        </p>
      </div>
      <AppointmentActions
        id={appointment.id}
        status={appointment.status}
        patient={appointment.patient.fullName}
      />
    </div>
  );
}

export function AppointmentInfo({
  appointment,
}: {
  appointment: AppointmentDetail;
}) {
  const duration =
    localMinutes(appointment.endsAt) - localMinutes(appointment.startsAt);
  const transaction = appointment.transaction;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
      <section className="flex flex-col gap-6 border border-neutral-100 bg-white p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoTile
            icon={RiCalendarLine}
            title={dayAndMonth(localDay(appointment.startsAt))}
            description={weekdayAndYear(localDay(appointment.startsAt))}
          />
          <InfoTile
            icon={RiTimeLine}
            title={timeRange(appointment.startsAt, appointment.endsAt)}
            description={formatDuration(duration)}
          />
          <InfoTile
            icon={RiMoneyDollarCircleLine}
            title={formatCurrency(appointment.priceCents)}
            description={appointment.service.name}
          />
        </div>
        <Link
          href={`/painel/pacientes/${appointment.patient.id}`}
          className="focus-visible:outline-brand-700 flex items-center gap-4 py-2 hover:bg-neutral-50 focus-visible:outline-2"
        >
          <Avatar name={appointment.patient.fullName} size="l" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-subtitle-m truncate text-neutral-900">
              {appointment.patient.fullName}
            </span>
            <span className="text-body-s text-neutral-600">
              Ver ficha do paciente
            </span>
          </span>
          <RiArrowRightSLine aria-hidden className="size-5 text-neutral-600" />
        </Link>
        <div className="flex flex-col gap-2">
          <h2 className="text-subtitle-m text-neutral-900">Observações</h2>
          <p className="text-body-m whitespace-pre-line text-neutral-800">
            {appointment.notes || 'Nenhuma observação.'}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 border border-neutral-100 bg-white p-6">
        <h2 className="text-subtitle-m text-neutral-900">Situação</h2>
        <dl className="flex flex-col gap-3">
          <Row label="Status">
            {APPOINTMENT_STATUS[appointment.status].label}
          </Row>
          <Row label="Marcado em">{formatDateTime(appointment.createdAt)}</Row>
          {appointment.completedAt && (
            <Row label="Concluído em">
              {formatDateTime(appointment.completedAt)}
            </Row>
          )}
          {appointment.canceledAt && (
            <Row label="Cancelado em">
              {formatDateTime(appointment.canceledAt)}
            </Row>
          )}
          {appointment.cancelReason && (
            <Row label="Motivo">{appointment.cancelReason}</Row>
          )}
          {transaction && (
            <>
              <Row label="Pagamento">
                {transaction.status === 'PAID' ? (
                  <Badge color="success" size="s" dot>
                    Pago
                  </Badge>
                ) : transaction.status === 'PENDING' ? (
                  <Badge color="warning" size="s" dot>
                    A receber
                  </Badge>
                ) : (
                  <Badge color="gray" size="s" dot>
                    Cancelado
                  </Badge>
                )}
              </Row>
              {transaction.paymentMethod && (
                <Row label="Forma">
                  {PAYMENT_METHODS[transaction.paymentMethod].label}
                </Row>
              )}
              <Row label="Valor">{formatCurrency(transaction.amountCents)}</Row>
            </>
          )}
        </dl>
      </section>
    </div>
  );
}

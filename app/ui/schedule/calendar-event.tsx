import clsx from 'clsx';
import Link from 'next/link';
import {
  APPOINTMENT_STATUS,
  type Appointment,
  type AppointmentStatus,
} from '@/app/lib/definitions';
import { timeRange } from '@/app/lib/schedule';

export const EVENT_COLORS: Record<AppointmentStatus, string> = {
  SCHEDULED: 'border-brand-700 bg-brand-50',
  CONFIRMED: 'border-warning-solid bg-warning-soft',
  COMPLETED: 'border-success-solid bg-success-soft',
  NO_SHOW: 'border-error-solid bg-error-soft',
  CANCELED: 'border-neutral-500 bg-neutral-50',
};

export default function CalendarEvent({
  appointment,
  compact = false,
  className,
  style,
}: {
  appointment: Appointment;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const time = timeRange(appointment.startsAt, appointment.endsAt);
  const status = APPOINTMENT_STATUS[appointment.status];

  return (
    <Link
      href={`/painel/agenda/${appointment.id}`}
      title={`${appointment.patient.fullName} · ${appointment.service.name} · ${time} · ${status.label}`}
      style={style}
      className={clsx(
        'focus-visible:outline-brand-700 flex min-w-0 flex-col gap-0.5 overflow-hidden border-l-3 py-1.5 pr-2 pl-2.5 hover:brightness-95 focus-visible:outline-2',
        EVENT_COLORS[appointment.status],
        appointment.status === 'CANCELED' && 'opacity-70',
        className,
      )}
    >
      <span
        className={clsx(
          'text-subtitle-s truncate text-neutral-900',
          appointment.status === 'CANCELED' && 'line-through',
        )}
      >
        {compact && (
          <span className="font-normal text-neutral-600">
            {time.slice(0, 5)}{' '}
          </span>
        )}
        {appointment.patient.fullName}
      </span>
      {!compact && (
        <span className="text-body-xxs truncate text-neutral-600">
          {time} · {appointment.service.name}
        </span>
      )}
      <span className="sr-only">{status.label}</span>
    </Link>
  );
}

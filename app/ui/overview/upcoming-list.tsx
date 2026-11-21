import { RiCalendarLine } from '@remixicon/react';
import Link from 'next/link';
import { APPOINTMENT_STATUS, type Appointment } from '@/app/lib/definitions';
import {
  addDays,
  dayNumber,
  formatMinutes,
  localDay,
  localMinutes,
  WEEKDAY_SHORT,
  weekday,
} from '@/app/lib/schedule';
import { Badge } from '@/app/ui/badge';

function dayLabel(day: string, today: string) {
  if (day === today) return 'Hoje';
  if (day === addDays(today, 1)) return 'Amanhã';
  return `${WEEKDAY_SHORT[weekday(day)]}, ${dayNumber(day)}`;
}

export default function UpcomingList({
  appointments,
  today,
}: {
  appointments: Appointment[];
  today: string;
}) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <span className="bg-brand-100 flex size-12 items-center justify-center rounded-full">
          <RiCalendarLine aria-hidden className="text-brand-700 size-6" />
        </span>
        <p className="text-subtitle-m text-neutral-900">
          Nada marcado nos próximos dias
        </p>
        <Link
          href="/painel/agenda/novo"
          className="text-body-s text-brand-700 hover:underline"
        >
          Novo agendamento
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {appointments.map((appointment) => {
        const status = APPOINTMENT_STATUS[appointment.status];
        return (
          <li
            key={appointment.id}
            className="border-b border-neutral-100 last:border-b-0"
          >
            <Link
              href={`/painel/agenda/${appointment.id}`}
              className="focus-visible:outline-brand-700 flex items-center gap-4 py-3 hover:bg-neutral-50 focus-visible:outline-2"
            >
              <span className="flex w-20 shrink-0 flex-col gap-0.5">
                <span className="text-subtitle-m text-neutral-900">
                  {formatMinutes(localMinutes(appointment.startsAt))}
                </span>
                <span className="text-body-xs text-neutral-600">
                  {dayLabel(localDay(appointment.startsAt), today)}
                </span>
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-subtitle-m truncate text-neutral-900">
                  {appointment.patient.fullName}
                </span>
                <span className="text-body-s truncate text-neutral-600">
                  {appointment.service.name}
                </span>
              </span>
              <Badge color={status.color} size="s">
                {status.label}
              </Badge>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

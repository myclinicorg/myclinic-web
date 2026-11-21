import { RiCalendarLine } from '@remixicon/react';
import clsx from 'clsx';
import Link from 'next/link';
import { APPOINTMENT_STATUS, type Appointment } from '@/app/lib/definitions';
import {
  type CalendarView,
  dayNumber,
  formatMinutes,
  localDay,
  localMinutes,
  longDate,
  WEEKDAY_SHORT,
  weekDays,
  weekday,
} from '@/app/lib/schedule';
import { formatDuration } from '@/app/lib/utils';
import { Badge } from '@/app/ui/badge';
import EmptyState from '@/app/ui/empty-state';
import { type ScheduleFilters, scheduleHref } from '@/app/ui/schedule/links';

export default function DayList({
  view,
  day,
  today,
  appointments,
  filters,
  actions,
}: {
  view: CalendarView;
  day: string;
  today: string;
  appointments: Appointment[];
  filters: ScheduleFilters;
  actions?: React.ReactNode;
}) {
  const events = appointments
    .filter((appointment) => localDay(appointment.startsAt) === day)
    .toSorted((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <div className="flex flex-col gap-4">
      <nav
        aria-label="Dias da semana"
        className="grid grid-cols-7 gap-1 bg-neutral-100 p-1"
      >
        {weekDays(day).map((date) => (
          <Link
            key={date}
            href={scheduleHref(view, date, filters)}
            aria-current={date === day ? 'date' : undefined}
            className={clsx(
              'focus-visible:outline-brand-700 flex flex-col items-center gap-0.5 border py-1.5 focus-visible:outline-2',
              date === day
                ? 'border-neutral-200 bg-white text-neutral-900'
                : 'border-transparent text-neutral-600',
            )}
          >
            <span className="text-body-xxs">
              {WEEKDAY_SHORT[weekday(date)]}
            </span>
            <span
              className={clsx(
                'text-subtitle-s',
                date === today && 'text-brand-700',
              )}
            >
              {dayNumber(date)}
            </span>
          </Link>
        ))}
      </nav>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-subtitle-m text-neutral-900">
          {day === today ? 'Hoje · ' : ''}
          {longDate(day)}
        </h2>
        {actions}
      </div>
      {events.length === 0 ? (
        <div className="border border-neutral-100 bg-white">
          <EmptyState
            icon={RiCalendarLine}
            title="Nenhum atendimento"
            description={
              filters.status || filters.patientId
                ? 'Nenhum atendimento neste dia com os filtros aplicados.'
                : 'Não há atendimentos marcados para este dia.'
            }
          />
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((appointment) => {
            const start = localMinutes(appointment.startsAt);
            const end = localMinutes(appointment.endsAt);
            const status = APPOINTMENT_STATUS[appointment.status];
            return (
              <li key={appointment.id}>
                <Link
                  href={`/painel/agenda/${appointment.id}`}
                  className="focus-visible:outline-brand-700 flex items-center gap-4 border border-neutral-100 bg-white p-4 hover:bg-neutral-50 focus-visible:outline-2"
                >
                  <div className="flex w-16 shrink-0 flex-col gap-0.5">
                    <span className="text-subtitle-m text-neutral-900">
                      {formatMinutes(start)}
                    </span>
                    <span className="text-body-s text-neutral-600">
                      {formatDuration(end - start)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-subtitle-m truncate text-neutral-900">
                      {appointment.patient.fullName}
                    </span>
                    <span className="text-body-s truncate text-neutral-600">
                      {appointment.service.name}
                    </span>
                  </div>
                  <Badge color={status.color} size="s">
                    {status.label}
                  </Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

import clsx from 'clsx';
import Link from 'next/link';
import type { Appointment } from '@/app/lib/definitions';
import {
  dayNumber,
  localDay,
  monthWeeks,
  WEEKDAY_SHORT,
  weekday,
} from '@/app/lib/schedule';
import CalendarEvent from '@/app/ui/schedule/calendar-event';
import { scheduleHref } from '@/app/ui/schedule/calendar-toolbar';

const MAX_EVENTS = 3;

export default function MonthView({
  day,
  today,
  appointments,
}: {
  day: string;
  today: string;
  appointments: Appointment[];
}) {
  const weeks = monthWeeks(day);
  const month = day.slice(0, 7);
  const byDay = Map.groupBy(appointments, (appointment) =>
    localDay(appointment.startsAt),
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-180">
        <div className="grid grid-cols-7">
          {weeks[0].map((date) => (
            <div
              key={date}
              className="text-body-xs border-b border-neutral-100 px-2 py-1.5 text-neutral-600"
            >
              {WEEKDAY_SHORT[weekday(date)]}
            </div>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0]} className="grid grid-cols-7">
            {week.map((date) => {
              const events = byDay.get(date) ?? [];
              const outside = date.slice(0, 7) !== month;
              return (
                <div
                  key={date}
                  className={clsx(
                    'flex min-h-28 min-w-0 flex-col gap-1 border-r border-b border-neutral-100 p-2 last:border-r-0',
                    outside && 'bg-neutral-50',
                  )}
                >
                  <Link
                    href={scheduleHref('semana', date)}
                    aria-label={`Ver a semana de ${dayNumber(date)}`}
                    className={clsx(
                      'text-body-s focus-visible:outline-brand-700 flex size-6 items-center justify-center rounded-full focus-visible:outline-2',
                      date === today
                        ? 'bg-brand-700 text-white'
                        : outside
                          ? 'text-neutral-400'
                          : 'text-neutral-800 hover:bg-neutral-100',
                    )}
                  >
                    {dayNumber(date)}
                  </Link>
                  {events.slice(0, MAX_EVENTS).map((appointment) => (
                    <CalendarEvent
                      key={appointment.id}
                      appointment={appointment}
                      compact
                    />
                  ))}
                  {events.length > MAX_EVENTS && (
                    <Link
                      href={scheduleHref('semana', date)}
                      className="text-body-xs text-brand-700 px-1 hover:underline"
                    >
                      +{events.length - MAX_EVENTS} mais
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

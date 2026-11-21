import clsx from 'clsx';
import type { Appointment } from '@/app/lib/definitions';
import {
  dayNumber,
  formatMinutes,
  layoutLanes,
  localDay,
  localMinutes,
  WEEKDAY_SHORT,
  weekDays,
  weekday,
} from '@/app/lib/schedule';
import CalendarEvent from '@/app/ui/schedule/calendar-event';

const HOUR_HEIGHT = 64;

export default function WeekView({
  day,
  today,
  appointments,
  openingMinutes = 8 * 60,
  closingMinutes = 18 * 60,
  workingDays,
}: {
  day: string;
  today: string;
  appointments: Appointment[];
  openingMinutes?: number;
  closingMinutes?: number;
  workingDays: number[];
}) {
  const days = weekDays(day);
  const events = appointments.map((appointment) => ({
    appointment,
    day: localDay(appointment.startsAt),
    start: localMinutes(appointment.startsAt),
    end: localMinutes(appointment.endsAt) || 24 * 60,
  }));
  const firstHour = Math.floor(
    Math.min(openingMinutes, ...events.map((event) => event.start)) / 60,
  );
  const lastHour = Math.ceil(
    Math.max(closingMinutes, ...events.map((event) => event.end)) / 60,
  );
  const hours = Array.from(
    { length: lastHour - firstHour },
    (_, i) => firstHour + i,
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-180">
        <div className="flex">
          <div className="h-12 w-16 shrink-0 border-r border-b border-neutral-100" />
          {days.map((date) => (
            <div
              key={date}
              className="flex min-w-0 flex-1 flex-col gap-0.5 border-r border-b border-neutral-100 px-3 py-1.5 last:border-r-0"
            >
              <span className="text-body-xs text-neutral-600">
                {WEEKDAY_SHORT[weekday(date)]}
              </span>
              <span
                className={clsx(
                  'text-subtitle-m',
                  date === today ? 'text-brand-700' : 'text-neutral-900',
                )}
              >
                {dayNumber(date)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <div className="w-16 shrink-0">
            {hours.map((hour) => (
              <div
                key={hour}
                className="text-body-xxs flex h-16 justify-end border-r border-b border-neutral-100 px-2 py-1 text-neutral-600"
              >
                {formatMinutes(hour * 60)}
              </div>
            ))}
          </div>
          {days.map((date) => (
            <div
              key={date}
              className={clsx(
                'relative min-w-0 flex-1 border-r border-neutral-100 last:border-r-0',
                !workingDays.includes(weekday(date)) && 'bg-neutral-50',
              )}
              style={{ height: hours.length * HOUR_HEIGHT }}
            >
              {hours.map((hour, index) => (
                <div
                  key={hour}
                  aria-hidden
                  className="absolute inset-x-0 h-px bg-neutral-100"
                  style={{ top: (index + 1) * HOUR_HEIGHT - 1 }}
                />
              ))}
              {layoutLanes(events.filter((event) => event.day === date)).map(
                (event) => {
                  const top =
                    ((event.start - firstHour * 60) / 60) * HOUR_HEIGHT + 2;
                  const height = Math.max(
                    ((event.end - event.start) / 60) * HOUR_HEIGHT - 4,
                    24,
                  );
                  const width = `calc((100% - 8px) / ${event.lanes})`;
                  return (
                    <CalendarEvent
                      key={event.appointment.id}
                      appointment={event.appointment}
                      compact={height < 40}
                      className="absolute"
                      style={{
                        top,
                        height,
                        width,
                        left: `calc(4px + ${width} * ${event.lane})`,
                      }}
                    />
                  );
                },
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

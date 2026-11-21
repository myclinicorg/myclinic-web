import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import Link from 'next/link';
import {
  type CalendarView,
  periodTitle,
  shiftPeriod,
} from '@/app/lib/schedule';
import { buttonClasses } from '@/app/ui/button';
import { type ScheduleFilters, scheduleHref } from '@/app/ui/schedule/links';
import SegmentedControl from '@/app/ui/segmented-control';

export default function CalendarToolbar({
  view,
  day,
  today,
  filters,
  actions,
}: {
  view: CalendarView;
  day: string;
  today: string;
  filters: ScheduleFilters;
  actions?: React.ReactNode;
}) {
  const label = view === 'semana' ? 'semana' : 'mês';
  return (
    <div className="flex flex-col gap-3 border-b border-neutral-100 px-5 py-4 lg:flex-row lg:items-center">
      <h2 className="text-heading-5 flex-1 text-neutral-900">
        {periodTitle(view, day)}
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={scheduleHref(view, today, filters)}
          className={buttonClasses({
            hierarchy: 'secondary',
            color: 'gray',
            size: 's',
          })}
        >
          Hoje
        </Link>
        <div className="flex">
          <Link
            href={scheduleHref(view, shiftPeriod(view, day, -1), filters)}
            aria-label={`${label === 'mês' ? 'Mês' : 'Semana'} anterior`}
            className={buttonClasses({
              hierarchy: 'tertiary',
              color: 'gray',
              size: 's',
              iconOnly: true,
            })}
          >
            <RiArrowLeftSLine aria-hidden className="size-5" />
          </Link>
          <Link
            href={scheduleHref(view, shiftPeriod(view, day, 1), filters)}
            aria-label={`Próxim${label === 'mês' ? 'o mês' : 'a semana'}`}
            className={buttonClasses({
              hierarchy: 'tertiary',
              color: 'gray',
              size: 's',
              iconOnly: true,
            })}
          >
            <RiArrowRightSLine aria-hidden className="size-5" />
          </Link>
        </div>
        <SegmentedControl
          label="Visualização"
          items={[
            {
              label: 'Mês',
              href: scheduleHref('mes', day, filters),
              active: view === 'mes',
            },
            {
              label: 'Semana',
              href: scheduleHref('semana', day, filters),
              active: view === 'semana',
            },
          ]}
        />
        {actions}
      </div>
    </div>
  );
}

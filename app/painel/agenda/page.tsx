import { RiAddLine } from '@remixicon/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { requireClinic } from '@/app/lib/dal';
import { fetchClinic, fetchSchedule } from '@/app/lib/data';
import {
  APPOINTMENT_STATUS,
  type AppointmentStatus,
} from '@/app/lib/definitions';
import { type CalendarView, isValidDay, parseTime } from '@/app/lib/schedule';
import { buttonClasses } from '@/app/ui/button';
import PageHeader from '@/app/ui/page-header';
import CalendarToolbar from '@/app/ui/schedule/calendar-toolbar';
import DayList from '@/app/ui/schedule/day-list';
import ScheduleFiltersButton from '@/app/ui/schedule/filters';
import type { ScheduleFilters } from '@/app/ui/schedule/links';
import MonthView from '@/app/ui/schedule/month-view';
import WeekView from '@/app/ui/schedule/week-view';
import { CalendarSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Agenda',
};

async function Schedule({
  searchParams,
}: {
  searchParams: PageProps<'/painel/agenda'>['searchParams'];
}) {
  await requireClinic();
  const params = await searchParams;
  const view: CalendarView = params.view === 'mes' ? 'mes' : 'semana';
  const filters: ScheduleFilters = {
    status:
      typeof params.status === 'string' && params.status in APPOINTMENT_STATUS
        ? (params.status as AppointmentStatus)
        : undefined,
    patientId:
      typeof params.paciente === 'string' &&
      /^[0-9a-f-]{36}$/i.test(params.paciente)
        ? params.paciente
        : undefined,
  };
  const [clinic, { today, day, appointments, patients }] = await Promise.all([
    fetchClinic(),
    fetchSchedule(
      view,
      isValidDay(params.data) ? params.data : undefined,
      filters,
    ),
  ]);
  const filterButton = (idPrefix: string) => (
    <ScheduleFiltersButton
      key={JSON.stringify(filters)}
      view={view}
      day={day}
      filters={filters}
      patients={patients}
      idPrefix={idPrefix}
    />
  );

  return (
    <>
      <div className="md:hidden">
        <DayList
          view={view}
          day={day}
          today={today}
          appointments={appointments}
          filters={filters}
          actions={filterButton('schedule-filter-mobile')}
        />
      </div>
      <section className="hidden border border-neutral-100 bg-white md:block">
        <CalendarToolbar
          view={view}
          day={day}
          today={today}
          filters={filters}
          actions={filterButton('schedule-filter')}
        />
        {view === 'semana' ? (
          <WeekView
            day={day}
            today={today}
            appointments={appointments}
            openingMinutes={parseTime(clinic.openingTime)}
            closingMinutes={parseTime(clinic.closingTime)}
            workingDays={clinic.workingDays}
          />
        ) : (
          <MonthView
            day={day}
            today={today}
            appointments={appointments}
            filters={filters}
          />
        )}
      </section>
    </>
  );
}

export default function Page(props: PageProps<'/painel/agenda'>) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Agenda"
        description="Atendimentos marcados, confirmados e concluídos."
        actions={
          <Link href="/painel/agenda/novo" className={buttonClasses()}>
            <RiAddLine aria-hidden />
            Novo agendamento
          </Link>
        }
      />
      <Suspense fallback={<CalendarSkeleton />}>
        <Schedule searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

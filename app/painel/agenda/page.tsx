import { RiAddLine } from '@remixicon/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { requireClinic } from '@/app/lib/dal';
import { fetchClinic, fetchSchedule } from '@/app/lib/data';
import { type CalendarView, isValidDay, parseTime } from '@/app/lib/schedule';
import { buttonClasses } from '@/app/ui/button';
import PageHeader from '@/app/ui/page-header';
import CalendarToolbar from '@/app/ui/schedule/calendar-toolbar';
import DayList from '@/app/ui/schedule/day-list';
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
  const [clinic, { today, day, appointments }] = await Promise.all([
    fetchClinic(),
    fetchSchedule(view, isValidDay(params.data) ? params.data : undefined),
  ]);

  return (
    <>
      <div className="md:hidden">
        <DayList
          view={view}
          day={day}
          today={today}
          appointments={appointments}
        />
      </div>
      <section className="hidden border border-neutral-100 bg-white md:block">
        <CalendarToolbar view={view} day={day} today={today} />
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
          <MonthView day={day} today={today} appointments={appointments} />
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

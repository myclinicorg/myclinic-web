import type { AppointmentStatus } from '@/app/lib/definitions';
import type { CalendarView } from '@/app/lib/schedule';

export type ScheduleFilters = {
  status?: AppointmentStatus;
  patientId?: string;
};

export function scheduleHref(
  view: CalendarView,
  day: string,
  filters: ScheduleFilters = {},
) {
  const search = new URLSearchParams({ view, data: day });
  if (filters.status) search.set('status', filters.status);
  if (filters.patientId) search.set('paciente', filters.patientId);
  return `/painel/agenda?${search}`;
}

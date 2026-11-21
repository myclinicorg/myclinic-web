import 'server-only';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { cache } from 'react';
import { api } from '@/app/lib/api';
import type {
  Appointment,
  AppointmentStatus,
  Patient,
} from '@/app/lib/definitions';
import {
  addDays,
  addMonths,
  type CalendarView,
  localDay,
  rangeFor,
  startOfMonth,
} from '@/app/lib/schedule';
import { currentMonthRange, toSaoPauloIso } from '@/app/lib/utils';

export const ITEMS_PER_PAGE = 10;

function handleFailure(response: Response, message: string): never {
  if (response.status === 401) {
    redirect('/sessao-expirada');
  }
  if (response.status === 403) {
    redirect('/painel/clinica');
  }
  throw new Error(message);
}

export async function fetchClinic() {
  await connection();
  const { data, response } = await api.GET('/clinic');
  if (!data) {
    handleFailure(response, 'Falha ao carregar os dados da clínica.');
  }
  return data;
}

export const fetchFilteredPatients = cache(async function fetchFilteredPatients(
  query: string,
  currentPage: number,
) {
  await connection();
  const { data, response } = await api.GET('/patients', {
    params: {
      query: {
        search: query || undefined,
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
      },
    },
  });
  if (!data) {
    handleFailure(response, 'Falha ao carregar os pacientes.');
  }
  return data;
});

export async function fetchPatientById(id: string) {
  await connection();
  const { data, response } = await api.GET('/patients/{id}', {
    params: { path: { id } },
  });
  if (response.status === 404 || response.status === 400) {
    return null;
  }
  if (!data) {
    handleFailure(response, 'Falha ao carregar o paciente.');
  }
  return data;
}

export const fetchFilteredServices = cache(async function fetchFilteredServices(
  status: 'ativos' | 'inativos' | undefined,
  currentPage: number,
) {
  await connection();
  const { data, response } = await api.GET('/services', {
    params: {
      query: {
        active: status ? String(status === 'ativos') : undefined,
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
      },
    },
  });
  if (!data) {
    handleFailure(response, 'Falha ao carregar os serviços.');
  }
  return data;
});

export async function fetchServiceById(id: string) {
  await connection();
  const { data, response } = await api.GET('/services/{id}', {
    params: { path: { id } },
  });
  if (response.status === 404 || response.status === 400) {
    return null;
  }
  if (!data) {
    handleFailure(response, 'Falha ao carregar o serviço.');
  }
  return data;
}

async function countAppointments(query: {
  from?: string;
  to?: string;
  status?: AppointmentStatus;
  patientId?: string;
}) {
  const { data, response } = await api.GET('/appointments', {
    params: { query: { ...query, page: 1, pageSize: 1 } },
  });
  if (!data) {
    handleFailure(response, 'Falha ao carregar os atendimentos.');
  }
  return data.meta.total;
}

export async function fetchPatientStats() {
  await connection();
  const month = currentMonthRange();
  const now = new Date();
  const nextWeek = {
    from: toSaoPauloIso(now),
    to: toSaoPauloIso(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
  };
  const [patients, completed, scheduled, confirmed, noShows] =
    await Promise.all([
      fetchFilteredPatients('', 1),
      countAppointments({ ...month, status: 'COMPLETED' }),
      countAppointments({ ...nextWeek, status: 'SCHEDULED' }),
      countAppointments({ ...nextWeek, status: 'CONFIRMED' }),
      countAppointments({ ...month, status: 'NO_SHOW' }),
    ]);
  return {
    patients: patients.meta.total,
    completedThisMonth: completed,
    upcoming: scheduled + confirmed,
    noShowsThisMonth: noShows,
  };
}

export const fetchServiceStats = cache(async function fetchServiceStats() {
  await connection();
  const [active, inactive] = await Promise.all([
    api.GET('/services', {
      params: { query: { active: 'true', page: 1, pageSize: 100 } },
    }),
    api.GET('/services', {
      params: { query: { active: 'false', page: 1, pageSize: 1 } },
    }),
  ]);
  if (!active.data) {
    handleFailure(active.response, 'Falha ao carregar os serviços.');
  }
  if (!inactive.data) {
    handleFailure(inactive.response, 'Falha ao carregar os serviços.');
  }
  const services = active.data.data;
  const average = (values: number[]) =>
    values.length
      ? Math.round(
          values.reduce((sum, value) => sum + value, 0) / values.length,
        )
      : 0;
  return {
    active: active.data.meta.total,
    inactive: inactive.data.meta.total,
    averagePriceCents: average(services.map((service) => service.priceCents)),
    averageDuration: average(
      services.map((service) => service.durationMinutes),
    ),
  };
});

export async function fetchPatientAppointments(patientId: string) {
  await connection();
  const { data, response } = await api.GET('/appointments', {
    params: { query: { patientId, page: 1, pageSize: 100 } },
  });
  if (!data) {
    handleFailure(response, 'Falha ao carregar os atendimentos.');
  }
  const now = Date.now();
  return data.data.toReversed().map((appointment) => ({
    ...appointment,
    isUpcoming: new Date(appointment.startsAt).getTime() >= now,
  }));
}

export type PatientAppointment = Awaited<
  ReturnType<typeof fetchPatientAppointments>
>[number];

async function fetchAppointmentsBetween(from: string, to: string) {
  const appointments: Appointment[] = [];
  for (let page = 1; ; page += 1) {
    const { data, response } = await api.GET('/appointments', {
      params: { query: { from, to, page, pageSize: 100 } },
    });
    if (!data) {
      handleFailure(response, 'Falha ao carregar a agenda.');
    }
    appointments.push(...data.data);
    if (page >= data.meta.totalPages) break;
  }
  return appointments;
}

export async function fetchSchedule(view: CalendarView, requestedDay?: string) {
  await connection();
  const today = toSaoPauloIso(new Date()).slice(0, 10);
  const day = requestedDay ?? today;
  const range = rangeFor(view, day);
  const appointments = await fetchAppointmentsBetween(range.from, range.to);
  return { today, day, appointments };
}

export const BOOKING_WINDOW_DAYS = 60;

export async function fetchBookingOptions() {
  await connection();
  const now = toSaoPauloIso(new Date());
  const today = now.slice(0, 10);
  const lastDay = addDays(today, BOOKING_WINDOW_DAYS);
  const [clinic, patients, services, appointments] = await Promise.all([
    fetchClinic(),
    fetchAllPatients(),
    api.GET('/services', {
      params: { query: { active: 'true', page: 1, pageSize: 100 } },
    }),
    fetchAppointmentsBetween(
      `${today}T00:00:00-03:00`,
      `${lastDay}T00:00:00-03:00`,
    ),
  ]);
  if (!services.data) {
    handleFailure(services.response, 'Falha ao carregar os serviços.');
  }
  return {
    today,
    lastDay,
    nowMinutes: Number(now.slice(11, 13)) * 60 + Number(now.slice(14, 16)),
    clinic,
    patients,
    services: services.data.data,
    busy: appointments
      .filter(
        (appointment) =>
          appointment.status !== 'CANCELED' && appointment.status !== 'NO_SHOW',
      )
      .map(({ startsAt, endsAt }) => ({ startsAt, endsAt })),
  };
}

async function fetchAllPatients() {
  const patients: Patient[] = [];
  for (let page = 1; ; page += 1) {
    const { data, response } = await api.GET('/patients', {
      params: { query: { page, pageSize: 100 } },
    });
    if (!data) {
      handleFailure(response, 'Falha ao carregar os pacientes.');
    }
    patients.push(...data.data);
    if (page >= data.meta.totalPages) break;
  }
  return patients;
}

export async function fetchAppointmentById(id: string) {
  await connection();
  const { data, response } = await api.GET('/appointments/{id}', {
    params: { path: { id } },
  });
  if (response.status === 404 || response.status === 400) {
    return null;
  }
  if (!data) {
    handleFailure(response, 'Falha ao carregar o atendimento.');
  }
  return data;
}

const MONTH_SHORT = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

async function fetchSummary(from?: string, to?: string) {
  const { data, response } = await api.GET('/transactions/summary', {
    params: { query: { from, to } },
  });
  if (!data) {
    handleFailure(response, 'Falha ao carregar o caixa.');
  }
  return data;
}

export async function fetchOverview() {
  await connection();
  const now = toSaoPauloIso(new Date());
  const today = now.slice(0, 10);
  const monthStart = startOfMonth(today);
  const months = Array.from({ length: 6 }, (_, i) =>
    addMonths(monthStart, i - 5),
  );
  const statuses: AppointmentStatus[] = [
    'SCHEDULED',
    'CONFIRMED',
    'COMPLETED',
    'NO_SHOW',
    'CANCELED',
  ];
  const monthRange = currentMonthRange();

  const [week, allTime, monthly, statusCounts, lowStock] = await Promise.all([
    fetchAppointmentsBetween(
      `${today}T00:00:00-03:00`,
      `${addDays(today, 8)}T00:00:00-03:00`,
    ),
    fetchSummary(),
    Promise.all(
      months.map((month) =>
        fetchSummary(month, addDays(addMonths(month, 1), -1)),
      ),
    ),
    Promise.all(
      statuses.map((status) => countAppointments({ ...monthRange, status })),
    ),
    api.GET('/supplies', {
      params: {
        query: { active: 'true', lowStock: 'true', page: 1, pageSize: 5 },
      },
    }),
  ]);
  if (!lowStock.data) {
    handleFailure(lowStock.response, 'Falha ao carregar o estoque.');
  }

  const open = week.filter(
    (appointment) =>
      appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED',
  );

  return {
    today,
    todayCount: week.filter(
      (appointment) =>
        localDay(appointment.startsAt) === today &&
        appointment.status !== 'CANCELED',
    ).length,
    upcoming: open
      .filter((appointment) => appointment.startsAt > now)
      .slice(0, 5),
    incomeThisMonthCents: monthly[5].incomeCents,
    pendingIncomeCents: allTime.pendingIncomeCents,
    revenue: months.map((month, i) => ({
      month: `${MONTH_SHORT[Number(month.slice(5, 7)) - 1]}`,
      year: month.slice(0, 4),
      incomeCents: monthly[i].incomeCents,
      expenseCents: monthly[i].expenseCents,
    })),
    statusCounts: statuses.map((status, i) => ({
      status,
      count: statusCounts[i],
    })),
    lowStock: lowStock.data.data,
    lowStockTotal: lowStock.data.meta.total,
  };
}

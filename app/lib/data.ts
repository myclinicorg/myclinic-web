import 'server-only';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { cache } from 'react';
import { api } from '@/app/lib/api';
import type {
  Appointment,
  AppointmentStatus,
  Patient,
  Supply,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from '@/app/lib/definitions';
import {
  addDays,
  addMonths,
  type BookingRules,
  type CalendarView,
  localDay,
  parseTime,
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

async function fetchAppointmentsBetween(
  from: string,
  to: string,
  filters: { status?: AppointmentStatus; patientId?: string } = {},
) {
  const appointments: Appointment[] = [];
  for (let page = 1; ; page += 1) {
    const { data, response } = await api.GET('/appointments', {
      params: { query: { from, to, ...filters, page, pageSize: 100 } },
    });
    if (!data) {
      handleFailure(response, 'Falha ao carregar a agenda.');
    }
    appointments.push(...data.data);
    if (page >= data.meta.totalPages) break;
  }
  return appointments;
}

export async function fetchSchedule(
  view: CalendarView,
  requestedDay?: string,
  filters: { status?: AppointmentStatus; patientId?: string } = {},
) {
  await connection();
  const today = toSaoPauloIso(new Date()).slice(0, 10);
  const day = requestedDay ?? today;
  const range = rangeFor(view, day);
  const [appointments, patients] = await Promise.all([
    fetchAppointmentsBetween(range.from, range.to, filters),
    fetchAllPatients(),
  ]);
  return {
    today,
    day,
    appointments,
    patients: patients.map(({ id, fullName }) => ({ id, fullName })),
  };
}

export const BOOKING_WINDOW_DAYS = 60;

async function fetchBookingRules(ignoreId?: string): Promise<BookingRules> {
  await connection();
  const now = toSaoPauloIso(new Date());
  const today = now.slice(0, 10);
  const lastDay = addDays(today, BOOKING_WINDOW_DAYS);
  const [clinic, appointments] = await Promise.all([
    fetchClinic(),
    fetchAppointmentsBetween(
      `${today}T00:00:00-03:00`,
      `${lastDay}T00:00:00-03:00`,
    ),
  ]);
  return {
    today,
    lastDay,
    nowMinutes: Number(now.slice(11, 13)) * 60 + Number(now.slice(14, 16)),
    openingMinutes: parseTime(clinic.openingTime) ?? 8 * 60,
    closingMinutes: parseTime(clinic.closingTime) ?? 18 * 60,
    workingDays: clinic.workingDays,
    busy: appointments
      .filter(
        (appointment) =>
          appointment.id !== ignoreId &&
          appointment.status !== 'CANCELED' &&
          appointment.status !== 'NO_SHOW',
      )
      .map(({ startsAt, endsAt }) => ({ startsAt, endsAt })),
  };
}

export async function fetchBookingOptions() {
  const [rules, patients, services] = await Promise.all([
    fetchBookingRules(),
    fetchAllPatients(),
    api.GET('/services', {
      params: { query: { active: 'true', page: 1, pageSize: 100 } },
    }),
  ]);
  if (!services.data) {
    handleFailure(services.response, 'Falha ao carregar os serviços.');
  }
  return { rules, patients, services: services.data.data };
}

export async function fetchRescheduleOptions(id: string) {
  const [appointment, rules] = await Promise.all([
    fetchAppointmentById(id),
    fetchBookingRules(id),
  ]);
  return { appointment, rules };
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

export type CashflowFilters = {
  month: string;
  type?: TransactionType;
  status?: TransactionStatus;
  category?: TransactionCategory;
  page: number;
};

export function monthBounds(month: string) {
  return { from: month, to: addDays(addMonths(month, 1), -1) };
}

async function countTransactions(query: {
  from: string;
  to: string;
  type?: TransactionType;
  status?: TransactionStatus;
  category?: TransactionCategory;
}) {
  const { data, response } = await api.GET('/transactions', {
    params: { query: { ...query, page: 1, pageSize: 1 } },
  });
  if (!data) {
    handleFailure(response, 'Falha ao carregar os lançamentos.');
  }
  return data.meta.total;
}

export const fetchFilteredTransactions = cache(
  async function fetchFilteredTransactions(filters: CashflowFilters) {
    await connection();
    const { data, response } = await api.GET('/transactions', {
      params: {
        query: {
          ...monthBounds(filters.month),
          type: filters.type,
          status: filters.status,
          category: filters.category,
          page: filters.page,
          pageSize: ITEMS_PER_PAGE,
        },
      },
    });
    if (!data) {
      handleFailure(response, 'Falha ao carregar os lançamentos.');
    }
    return data;
  },
);

export async function fetchCashflowSummary(month: string) {
  await connection();
  const { from, to } = monthBounds(month);
  return fetchSummary(from, to);
}

export async function fetchTransactionTypeCounts(
  filters: Omit<CashflowFilters, 'type' | 'page'>,
) {
  await connection();
  const query = {
    ...monthBounds(filters.month),
    status: filters.status,
    category: filters.category,
  };
  const [all, income, expense] = await Promise.all([
    countTransactions(query),
    countTransactions({ ...query, type: 'INCOME' }),
    countTransactions({ ...query, type: 'EXPENSE' }),
  ]);
  return { all, income, expense };
}

export async function fetchTransactionById(id: string) {
  await connection();
  const { data, response } = await api.GET('/transactions/{id}', {
    params: { path: { id } },
  });
  if (response.status === 404 || response.status === 400) {
    return null;
  }
  if (!data) {
    handleFailure(response, 'Falha ao carregar o lançamento.');
  }
  return data;
}

export function currentMonth() {
  return `${toSaoPauloIso(new Date()).slice(0, 7)}-01`;
}

export async function currentDay() {
  await connection();
  return toSaoPauloIso(new Date()).slice(0, 10);
}

export type StockTab = 'todos' | 'baixo' | 'inativos';

function stockQuery(tab: StockTab) {
  if (tab === 'baixo') return { active: 'true', lowStock: 'true' };
  if (tab === 'inativos') return { active: 'false' };
  return { active: 'true' };
}

export const fetchFilteredSupplies = cache(async function fetchFilteredSupplies(
  tab: StockTab,
  currentPage: number,
) {
  await connection();
  const { data, response } = await api.GET('/supplies', {
    params: {
      query: {
        ...stockQuery(tab),
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
      },
    },
  });
  if (!data) {
    handleFailure(response, 'Falha ao carregar o estoque.');
  }
  return data;
});

async function fetchAllSupplies(active: 'true' | 'false') {
  const supplies: Supply[] = [];
  for (let page = 1; ; page += 1) {
    const { data, response } = await api.GET('/supplies', {
      params: { query: { active, page, pageSize: 100 } },
    });
    if (!data) {
      handleFailure(response, 'Falha ao carregar o estoque.');
    }
    supplies.push(...data.data);
    if (page >= data.meta.totalPages) break;
  }
  return supplies;
}

export const fetchStockStats = cache(async function fetchStockStats() {
  await connection();
  const [active, inactive] = await Promise.all([
    fetchAllSupplies('true'),
    fetchAllSupplies('false'),
  ]);
  return {
    active: active.length,
    inactive: inactive.length,
    low: active.filter(
      (supply) => Number(supply.currentQuantity) <= Number(supply.minQuantity),
    ).length,
    valueCents: Math.round(
      active.reduce(
        (sum, supply) =>
          sum + Number(supply.currentQuantity) * (supply.unitCostCents ?? 0),
        0,
      ),
    ),
  };
});

export async function fetchSupplyById(id: string) {
  await connection();
  const { data, response } = await api.GET('/supplies/{id}', {
    params: { path: { id } },
  });
  if (response.status === 404 || response.status === 400) {
    return null;
  }
  if (!data) {
    handleFailure(response, 'Falha ao carregar o insumo.');
  }
  return data;
}

export async function fetchSupplyMovements(id: string) {
  await connection();
  const { data, response } = await api.GET('/supplies/{id}/movements', {
    params: { path: { id }, query: { page: 1, pageSize: 50 } },
  });
  if (!data) {
    handleFailure(response, 'Falha ao carregar as movimentações.');
  }
  return data;
}

import 'server-only';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { cache } from 'react';
import { api } from '@/app/lib/api';
import type { AppointmentStatus } from '@/app/lib/definitions';
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

export async function fetchServiceStats() {
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
}

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

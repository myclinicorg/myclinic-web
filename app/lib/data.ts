import 'server-only';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { api } from '@/app/lib/api';

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

export async function fetchFilteredPatients(
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
}

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

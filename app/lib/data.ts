import 'server-only';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { api } from '@/app/lib/api';

export async function fetchClinic() {
  await connection();
  const { data, response } = await api.GET('/clinic');
  if (response.status === 401) {
    redirect('/sessao-expirada');
  }
  if (!data) {
    throw new Error('Falha ao carregar os dados da clínica.');
  }
  return data;
}

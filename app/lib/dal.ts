import 'server-only';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { cache } from 'react';
import { api } from '@/app/lib/api';
import { getSessionToken } from '@/app/lib/session';

export const verifySession = cache(async () => {
  const token = await getSessionToken();
  if (!token) {
    redirect('/entrar');
  }
  return { isAuth: true };
});

export const getCurrentUser = cache(async () => {
  await verifySession();
  await connection();
  const { data, response } = await api.GET('/me');
  if (response.status === 401) {
    redirect('/sessao-expirada');
  }
  if (!data) {
    throw new Error('Falha ao carregar o usuário.');
  }
  return data;
});

export const requireClinic = cache(async () => {
  const user = await getCurrentUser();
  if (!user.clinicId) {
    redirect('/painel/clinica');
  }
  return user;
});

'use server';

import { redirect } from 'next/navigation';
import { api } from '@/app/lib/api';
import {
  type FormState,
  LoginFormSchema,
  SignupFormSchema,
} from '@/app/lib/definitions';
import {
  createSession,
  deleteSession,
  readApiSession,
} from '@/app/lib/session';

export type LoginState = FormState<'email' | 'password'>;
export type SignupState = FormState<'name' | 'email' | 'password'>;

const TOO_MANY_ATTEMPTS =
  'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
const UNEXPECTED_ERROR = 'Não foi possível concluir. Tente novamente.';

export async function authenticate(
  state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { response } = await api.POST('/auth/sign-in', {
    body: validatedFields.data,
  });

  if (response.status === 401) {
    return { message: 'E-mail ou senha inválidos.' };
  }
  if (response.status === 429) {
    return { message: TOO_MANY_ATTEMPTS };
  }
  const session = response.ok ? readApiSession(response) : null;
  if (!session) {
    return { message: UNEXPECTED_ERROR };
  }

  await createSession(session.token, session.expires);
  redirect('/dashboard');
}

export async function signup(
  state: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { response } = await api.POST('/auth/sign-up', {
    body: validatedFields.data,
  });

  if (response.status === 409) {
    return { errors: { email: ['Este e-mail já está cadastrado.'] } };
  }
  if (response.status === 429) {
    return { message: TOO_MANY_ATTEMPTS };
  }
  const session = response.ok ? readApiSession(response) : null;
  if (!session) {
    return { message: UNEXPECTED_ERROR };
  }

  await createSession(session.token, session.expires);
  redirect('/dashboard');
}

export async function logout() {
  await api.POST('/auth/sign-out');
  await deleteSession();
  redirect('/login');
}

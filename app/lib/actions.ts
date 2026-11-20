'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { api } from '@/app/lib/api';
import {
  ClinicFormSchema,
  type ClinicField,
  ForgotPasswordFormSchema,
  type FormState,
  LoginFormSchema,
  ResetPasswordFormSchema,
  SignupFormSchema,
} from '@/app/lib/definitions';
import {
  createSession,
  deleteSession,
  readApiSession,
} from '@/app/lib/session';

export type LoginState = FormState<'email' | 'password'>;
export type SignupState = FormState<'name' | 'email' | 'password'>;
export type ForgotPasswordState =
  (FormState<'email'> & { sent?: boolean }) | undefined;
export type ResetPasswordState = FormState<'token' | 'password'>;
export type ClinicState =
  (FormState<ClinicField> & { saved?: boolean }) | undefined;

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

  const values = { email: String(formData.get('email') ?? '') };

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, values };
  }

  const { response } = await api.POST('/auth/sign-in', {
    body: validatedFields.data,
  });

  if (response.status === 401) {
    return { message: 'E-mail ou senha inválidos.', values };
  }
  if (response.status === 429) {
    return { message: TOO_MANY_ATTEMPTS, values };
  }
  const session = response.ok ? readApiSession(response) : null;
  if (!session) {
    return { message: UNEXPECTED_ERROR, values };
  }

  await createSession(session.token, session.expires);
  const { data: user } = await api.GET('/me');
  redirect(user?.clinicId === null ? '/painel/clinica' : '/painel');
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

  const values = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
  };

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, values };
  }

  const { response } = await api.POST('/auth/sign-up', {
    body: validatedFields.data,
  });

  if (response.status === 409) {
    return { errors: { email: ['Este e-mail já está cadastrado.'] }, values };
  }
  if (response.status === 429) {
    return { message: TOO_MANY_ATTEMPTS, values };
  }
  const session = response.ok ? readApiSession(response) : null;
  if (!session) {
    return { message: UNEXPECTED_ERROR, values };
  }

  await createSession(session.token, session.expires);
  redirect('/painel/clinica');
}

export async function requestPasswordReset(
  state: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const values = { email: String(formData.get('email') ?? '') };
  const validatedFields = ForgotPasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, values };
  }

  const { response } = await api.POST('/auth/password/forgot', {
    body: validatedFields.data,
  });

  if (response.status === 429) {
    return { message: TOO_MANY_ATTEMPTS, values };
  }
  if (!response.ok) {
    return { message: UNEXPECTED_ERROR, values };
  }
  return {
    sent: true,
    values,
    message:
      'Se existir uma conta com esse e-mail, você receberá um link em instantes.',
  };
}

export async function resetPassword(
  state: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const validatedFields = ResetPasswordFormSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { response } = await api.POST('/auth/password/reset', {
    body: validatedFields.data,
  });

  if (response.status === 400) {
    return {
      message: 'Este link é inválido ou expirou. Peça um novo link.',
    };
  }
  const session = response.ok ? readApiSession(response) : null;
  if (!session) {
    return { message: UNEXPECTED_ERROR };
  }

  await createSession(session.token, session.expires);
  redirect('/painel');
}

export async function logout() {
  await api.POST('/auth/sign-out');
  await deleteSession();
  redirect('/entrar');
}

const CLINIC_TEXT_FIELDS = [
  'name',
  'cnpj',
  'description',
  'phone',
  'contactEmail',
  'zipCode',
  'street',
  'streetNumber',
  'neighborhood',
  'addressComplement',
  'city',
  'state',
  'openingTime',
  'closingTime',
] as const;

function parseClinicForm(formData: FormData) {
  const values: Partial<Record<ClinicField, string>> = Object.fromEntries(
    CLINIC_TEXT_FIELDS.map((field) => [
      field,
      String(formData.get(field) ?? ''),
    ]),
  );
  const workingDays = formData.getAll('workingDays').map(String);
  values.workingDays = workingDays.join(',');

  const validatedFields = ClinicFormSchema.safeParse({
    ...values,
    workingDays,
  });
  return { validatedFields, values };
}

async function clinicErrorState(
  response: Response,
  error: unknown,
  values: Partial<Record<ClinicField, string>>,
): Promise<ClinicState> {
  if (response.status === 401) {
    redirect('/sessao-expirada');
  }
  const message =
    error && typeof error === 'object' && 'message' in error
      ? error.message
      : undefined;
  if (response.status === 409 && message === 'CNPJ já cadastrado') {
    return {
      errors: { cnpj: ['Já existe uma clínica com este CNPJ.'] },
      values,
    };
  }
  if (response.status === 400 || response.status === 409) {
    return {
      message: Array.isArray(message) ? message.join(' ') : String(message),
      values,
    };
  }
  return { message: UNEXPECTED_ERROR, values };
}

export async function createClinic(
  state: ClinicState,
  formData: FormData,
): Promise<ClinicState> {
  const { validatedFields, values } = parseClinicForm(formData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, values };
  }

  const { error, response } = await api.POST('/clinic', {
    body: validatedFields.data,
  });

  if (!response.ok) {
    return clinicErrorState(response, error, values);
  }

  revalidatePath('/painel', 'layout');
  redirect('/painel');
}

export async function updateClinic(
  state: ClinicState,
  formData: FormData,
): Promise<ClinicState> {
  const { validatedFields, values } = parseClinicForm(formData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, values };
  }

  const { error, response } = await api.PATCH('/clinic', {
    body: validatedFields.data,
  });

  if (!response.ok) {
    return clinicErrorState(response, error, values);
  }

  revalidatePath('/painel/clinica');
  return { saved: true, message: 'Dados da clínica salvos.', values };
}

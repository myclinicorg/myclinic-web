'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { api } from '@/app/lib/api';
import {
  ClinicFormSchema,
  type ClinicField,
  PatientFormSchema,
  type PatientField,
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
export type PatientState = FormState<PatientField>;
export type DeleteState = { message?: string } | undefined;
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

const ADDRESS_FIELDS = [
  'zipCode',
  'street',
  'streetNumber',
  'neighborhood',
  'addressComplement',
  'city',
  'state',
] as const;

const CLINIC_TEXT_FIELDS = [
  'name',
  'cnpj',
  'description',
  'phone',
  'contactEmail',
  ...ADDRESS_FIELDS,
  'openingTime',
  'closingTime',
] as const;

const PATIENT_FIELDS = [
  'fullName',
  'cpf',
  'sex',
  'dateOfBirth',
  'email',
  'phone',
  'notes',
  ...ADDRESS_FIELDS,
] as const;

function readValues<Field extends string>(
  formData: FormData,
  fields: readonly Field[],
) {
  return Object.fromEntries(
    fields.map((field) => [field, String(formData.get(field) ?? '')]),
  ) as Record<Field, string>;
}

function parseClinicForm(formData: FormData) {
  const values: Partial<Record<ClinicField, string>> = readValues(
    formData,
    CLINIC_TEXT_FIELDS,
  );
  const workingDays = formData.getAll('workingDays').map(String);
  values.workingDays = workingDays.join(',');

  const validatedFields = ClinicFormSchema.safeParse({
    ...values,
    workingDays,
  });
  return { validatedFields, values };
}

function apiErrorState<Field extends string>(
  response: Response,
  error: unknown,
  values: Partial<Record<Field, string>>,
  conflict?: { field: Field; apiMessage: string; message: string },
) {
  if (response.status === 401) {
    redirect('/sessao-expirada');
  }
  const message =
    error && typeof error === 'object' && 'message' in error
      ? error.message
      : undefined;
  if (response.status === 409 && conflict && message === conflict.apiMessage) {
    return {
      errors: { [conflict.field]: [conflict.message] } as Partial<
        Record<Field, string[]>
      >,
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

const CNPJ_CONFLICT = {
  field: 'cnpj',
  apiMessage: 'CNPJ já cadastrado',
  message: 'Já existe uma clínica com este CNPJ.',
} as const;

const CPF_CONFLICT = {
  field: 'cpf',
  apiMessage: 'CPF já cadastrado',
  message: 'Já existe um paciente com este CPF.',
} as const;

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
    return apiErrorState(response, error, values, CNPJ_CONFLICT);
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
    return apiErrorState(response, error, values, CNPJ_CONFLICT);
  }

  revalidatePath('/painel/clinica');
  return { saved: true, message: 'Dados da clínica salvos.', values };
}

export async function createPatient(
  state: PatientState,
  formData: FormData,
): Promise<PatientState> {
  const values = readValues(formData, PATIENT_FIELDS);
  const validatedFields = PatientFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, values };
  }

  const { error, response } = await api.POST('/patients', {
    body: validatedFields.data,
  });

  if (!response.ok) {
    return apiErrorState(response, error, values, CPF_CONFLICT);
  }

  revalidatePath('/painel/pacientes');
  redirect('/painel/pacientes');
}

export async function updatePatient(
  id: string,
  state: PatientState,
  formData: FormData,
): Promise<PatientState> {
  const values = readValues(formData, PATIENT_FIELDS);
  const validatedFields = PatientFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, values };
  }

  const { error, response } = await api.PATCH('/patients/{id}', {
    params: { path: { id } },
    body: validatedFields.data,
  });

  if (!response.ok) {
    return apiErrorState(response, error, values, CPF_CONFLICT);
  }

  revalidatePath('/painel/pacientes');
  redirect('/painel/pacientes');
}

export async function deletePatient(id: string): Promise<DeleteState> {
  const { error, response } = await api.DELETE('/patients/{id}', {
    params: { path: { id } },
  });

  if (!response.ok && response.status !== 404) {
    return apiErrorState(response, error, {});
  }

  revalidatePath('/painel/pacientes');
}

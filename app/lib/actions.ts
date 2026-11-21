'use server';

import { refresh, revalidatePath } from 'next/cache';
import * as z from 'zod';
import { redirect } from 'next/navigation';
import { api } from '@/app/lib/api';
import { setFlash } from '@/app/lib/flash';
import {
  ClinicFormSchema,
  type ClinicField,
  PatientFormSchema,
  type PatientField,
  ServiceFormSchema,
  type MovementField,
  MovementFormSchema,
  type ServiceField,
  type SupplyField,
  SupplyFormSchema,
  type TransactionCategory,
  type TransactionField,
  TransactionFormSchema,
  TransactionUpdateSchema,
  ForgotPasswordFormSchema,
  type FormState,
  LoginFormSchema,
  PAYMENT_METHODS,
  type PaymentMethod,
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
export type ServiceState = FormState<ServiceField>;
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
  await setFlash('Clínica cadastrada. Tudo pronto para começar!');
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

  const { data, error, response } = await api.POST('/patients', {
    body: validatedFields.data,
  });

  if (!data) {
    return apiErrorState(response, error, values, CPF_CONFLICT);
  }

  revalidatePath('/painel/pacientes');
  await setFlash('Paciente cadastrado.');
  redirect(`/painel/pacientes/${data.id}`);
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
  await setFlash('Alterações salvas.');
  redirect(`/painel/pacientes/${id}`);
}

export async function deletePatient(
  id: string,
  redirectTo?: string,
): Promise<DeleteState> {
  const { error, response } = await api.DELETE('/patients/{id}', {
    params: { path: { id } },
  });

  if (!response.ok && response.status !== 404) {
    return apiErrorState(response, error, {});
  }

  revalidatePath('/painel/pacientes');
  await setFlash('Paciente excluído.');
  if (redirectTo) {
    redirect(redirectTo);
  }
}

const SERVICE_FIELDS = [
  'name',
  'description',
  'price',
  'durationMinutes',
  'active',
] as const;

async function saveService(
  formData: FormData,
  id?: string,
): Promise<ServiceState> {
  const values = readValues(formData, SERVICE_FIELDS);
  const validatedFields = ServiceFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, values };
  }

  const { price, ...service } = validatedFields.data;
  const body = { ...service, priceCents: price };
  const { error, response } = id
    ? await api.PATCH('/services/{id}', { params: { path: { id } }, body })
    : await api.POST('/services', { body });

  if (!response.ok) {
    return apiErrorState(response, error, values);
  }

  revalidatePath('/painel/servicos');
  await setFlash(id ? 'Serviço atualizado.' : 'Serviço cadastrado.');
  redirect('/painel/servicos');
}

export async function createService(
  state: ServiceState,
  formData: FormData,
): Promise<ServiceState> {
  return saveService(formData);
}

export async function updateService(
  id: string,
  state: ServiceState,
  formData: FormData,
): Promise<ServiceState> {
  return saveService(formData, id);
}

export async function deleteService(id: string): Promise<DeleteState> {
  const { error, response } = await api.DELETE('/services/{id}', {
    params: { path: { id } },
  });

  if (!response.ok && response.status !== 404) {
    return apiErrorState(response, error, {});
  }

  revalidatePath('/painel/servicos');
  await setFlash('Serviço excluído.');
}

export type AppointmentActionState = { message?: string } | undefined;

const COMPLETE_SCHEMA = z.object({
  paymentMethod: z
    .enum(Object.keys(PAYMENT_METHODS) as [PaymentMethod, ...PaymentMethod[]])
    .optional(),
});

async function finishAppointmentAction(
  id: string,
  response: Response,
  error: unknown,
  flash: string,
): Promise<AppointmentActionState> {
  if (!response.ok) {
    const state = apiErrorState(response, error, {});
    return { message: state.message ?? UNEXPECTED_ERROR };
  }
  revalidatePath('/painel', 'layout');
  await setFlash(flash);
  redirect(`/painel/agenda/${id}`);
}

export async function confirmAppointment(
  id: string,
): Promise<AppointmentActionState> {
  const { error, response } = await api.POST('/appointments/{id}/confirm', {
    params: { path: { id } },
  });
  return finishAppointmentAction(
    id,
    response,
    error,
    'Atendimento confirmado.',
  );
}

export async function markNoShow(id: string): Promise<AppointmentActionState> {
  const { error, response } = await api.POST('/appointments/{id}/no-show', {
    params: { path: { id } },
  });
  return finishAppointmentAction(id, response, error, 'Falta registrada.');
}

export async function cancelAppointment(
  id: string,
  state: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  const reason = String(formData.get('reason') ?? '').trim();
  if (reason.length > 500) {
    return { message: 'O motivo deve ter no máximo 500 caracteres.' };
  }
  const { error, response } = await api.POST('/appointments/{id}/cancel', {
    params: { path: { id } },
    body: reason ? { reason } : {},
  });
  return finishAppointmentAction(id, response, error, 'Atendimento cancelado.');
}

export async function completeAppointment(
  id: string,
  state: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  const method = String(formData.get('paymentMethod') ?? '');
  const parsed = COMPLETE_SCHEMA.safeParse({
    paymentMethod: method === 'LATER' ? undefined : method,
  });
  if (!parsed.success) {
    return { message: 'Escolha como o atendimento foi pago.' };
  }
  const { error, response } = await api.POST('/appointments/{id}/complete', {
    params: { path: { id } },
    body: parsed.data,
  });
  return finishAppointmentAction(
    id,
    response,
    error,
    parsed.data.paymentMethod
      ? 'Atendimento concluído e pagamento registrado no caixa.'
      : 'Atendimento concluído. O valor ficou a receber no caixa.',
  );
}

export type BookingState = { message?: string; step?: number } | undefined;

const BOOKING_SCHEMA = z.object({
  patientId: z.uuid({ error: 'Escolha o paciente.' }),
  serviceId: z.uuid({ error: 'Escolha o serviço.' }),
  startsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00-03:00$/, {
    error: 'Escolha o dia e o horário.',
  }),
  notes: z
    .string()
    .trim()
    .max(500, { error: 'As observações devem ter no máximo 500 caracteres.' })
    .transform((value) => value || undefined),
});

const BOOKING_ERROR_STEPS: Record<string, number> = {
  SCHEDULE_CONFLICT: 2,
  PAST_DATE: 2,
  OUTSIDE_BUSINESS_HOURS: 2,
};

export async function createAppointment(
  state: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const parsed = BOOKING_SCHEMA.safeParse({
    patientId: formData.get('patientId') ?? '',
    serviceId: formData.get('serviceId') ?? '',
    startsAt: formData.get('startsAt') ?? '',
    notes: formData.get('notes') ?? '',
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const step = ['patientId', 'serviceId', 'startsAt', 'notes'].indexOf(
      String(issue.path[0]),
    );
    return { message: issue.message, step };
  }

  const { data, error, response } = await api.POST('/appointments', {
    body: parsed.data,
  });

  if (!data) {
    if (response.status === 401) {
      redirect('/sessao-expirada');
    }
    const body: unknown = error;
    const errorCode =
      body && typeof body === 'object' && 'errorCode' in body
        ? String(body.errorCode)
        : '';
    if (errorCode in BOOKING_ERROR_STEPS) {
      refresh();
    }
    if (errorCode === 'SCHEDULE_CONFLICT') {
      return {
        message: 'Esse horário acabou de ser ocupado. Escolha outro.',
        step: 2,
      };
    }
    const state = apiErrorState(response, error, {});
    return {
      message: state.message ?? UNEXPECTED_ERROR,
      step: BOOKING_ERROR_STEPS[errorCode],
    };
  }

  revalidatePath('/painel', 'layout');
  redirect(`/painel/agenda/${data.id}/agendado`);
}

export type TransactionState = FormState<TransactionField>;

const TRANSACTION_FIELDS = [
  'type',
  'category',
  'description',
  'amount',
  'dueDate',
  'paid',
  'paymentMethod',
] as const;

export async function createTransaction(
  state: TransactionState,
  formData: FormData,
): Promise<TransactionState> {
  const values = readValues(formData, TRANSACTION_FIELDS);
  const parsed = TransactionFormSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values };
  }
  const { amount, paid, paymentMethod, category, ...rest } = parsed.data;
  const { error, response } = await api.POST('/transactions', {
    body: {
      ...rest,
      category: category as TransactionCategory,
      amountCents: amount,
      paymentMethod: paid ? (paymentMethod as PaymentMethod) : undefined,
    },
  });
  if (!response.ok) {
    return apiErrorState(response, error, values);
  }
  revalidatePath('/painel', 'layout');
  await setFlash('Lançamento registrado.');
  redirect(`/painel/caixa?mes=${rest.dueDate.slice(0, 7)}`);
}

export async function updateTransaction(
  id: string,
  state: TransactionState,
  formData: FormData,
): Promise<TransactionState> {
  const values = readValues(formData, TRANSACTION_FIELDS);
  const parsed = TransactionUpdateSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values };
  }
  const { amount, category, ...rest } = parsed.data;
  const { error, response } = await api.PATCH('/transactions/{id}', {
    params: { path: { id } },
    body: {
      ...rest,
      category: category as TransactionCategory,
      amountCents: amount,
    },
  });
  if (!response.ok) {
    return apiErrorState(response, error, values);
  }
  revalidatePath('/painel', 'layout');
  await setFlash('Lançamento atualizado.');
  redirect(`/painel/caixa?mes=${rest.dueDate.slice(0, 7)}`);
}

export async function payTransaction(
  id: string,
  state: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  const method = String(formData.get('paymentMethod') ?? '');
  if (!(method in PAYMENT_METHODS)) {
    return { message: 'Escolha a forma de pagamento.' };
  }
  const { error, response } = await api.POST('/transactions/{id}/pay', {
    params: { path: { id } },
    body: { paymentMethod: method as PaymentMethod },
  });
  if (!response.ok) {
    return { message: apiErrorState(response, error, {}).message };
  }
  revalidatePath('/painel', 'layout');
  await setFlash('Pagamento registrado.');
  return undefined;
}

export async function cancelTransaction(id: string): Promise<DeleteState> {
  const { error, response } = await api.POST('/transactions/{id}/cancel', {
    params: { path: { id } },
  });
  if (!response.ok) {
    return { message: apiErrorState(response, error, {}).message };
  }
  revalidatePath('/painel', 'layout');
  await setFlash('Lançamento cancelado.');
  return undefined;
}

export type SupplyState = FormState<SupplyField>;
export type MovementState = FormState<MovementField>;

const SUPPLY_FIELDS = [
  'name',
  'description',
  'unit',
  'minQuantity',
  'unitCost',
  'active',
] as const;

const MOVEMENT_FIELDS = [
  'type',
  'quantity',
  'unitCost',
  'reason',
  'registerExpense',
  'paymentMethod',
] as const;

async function saveSupply(
  formData: FormData,
  id?: string,
): Promise<SupplyState> {
  const values = readValues(formData, SUPPLY_FIELDS);
  const parsed = SupplyFormSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values };
  }
  const { unitCost, ...supply } = parsed.data;
  const body = { ...supply, unitCostCents: unitCost };
  const { data, error, response } = id
    ? await api.PATCH('/supplies/{id}', { params: { path: { id } }, body })
    : await api.POST('/supplies', { body });
  if (!data) {
    return apiErrorState(response, error, values);
  }
  revalidatePath('/painel', 'layout');
  await setFlash(id ? 'Insumo atualizado.' : 'Insumo cadastrado.');
  redirect(`/painel/estoque/${data.id}`);
}

export async function createSupply(
  state: SupplyState,
  formData: FormData,
): Promise<SupplyState> {
  return saveSupply(formData);
}

export async function updateSupply(
  id: string,
  state: SupplyState,
  formData: FormData,
): Promise<SupplyState> {
  return saveSupply(formData, id);
}

export async function deleteSupply(
  id: string,
  redirectTo?: string,
): Promise<DeleteState> {
  const { error, response } = await api.DELETE('/supplies/{id}', {
    params: { path: { id } },
  });
  if (!response.ok) {
    return { message: apiErrorState(response, error, {}).message };
  }
  revalidatePath('/painel', 'layout');
  await setFlash('Insumo excluído.');
  if (redirectTo) {
    redirect(redirectTo);
  }
  return undefined;
}

export async function addMovement(
  id: string,
  state: MovementState,
  formData: FormData,
): Promise<MovementState> {
  const values = readValues(formData, MOVEMENT_FIELDS);
  const parsed = MovementFormSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values };
  }
  const { type, quantity, unitCost, reason, registerExpense, paymentMethod } =
    parsed.data;
  const expense = type === 'IN' && registerExpense;
  const { error, response } = await api.POST('/supplies/{id}/movements', {
    params: { path: { id } },
    body: {
      type,
      quantity,
      reason: reason ?? undefined,
      unitCostCents: type === 'IN' && unitCost !== null ? unitCost : undefined,
      registerExpense: expense || undefined,
      paymentMethod:
        expense && paymentMethod in PAYMENT_METHODS
          ? (paymentMethod as PaymentMethod)
          : undefined,
    },
  });
  if (!response.ok) {
    const body: unknown = error;
    if (
      body &&
      typeof body === 'object' &&
      'errorCode' in body &&
      body.errorCode === 'INSUFFICIENT_STOCK'
    ) {
      return {
        errors: { quantity: ['A saída é maior que o saldo em estoque.'] },
        values,
      };
    }
    return apiErrorState(response, error, values);
  }
  revalidatePath('/painel', 'layout');
  await setFlash(
    expense
      ? 'Movimentação registrada e despesa lançada no caixa.'
      : 'Movimentação registrada.',
  );
  redirect(`/painel/estoque/${id}`);
}

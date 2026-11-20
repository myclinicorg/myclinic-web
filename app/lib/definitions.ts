import * as z from 'zod';
import type { components } from '@/app/lib/api-schema';
import {
  isValidCnpj,
  isValidCpf,
  onlyDigits,
  parseCurrencyToCents,
} from '@/app/lib/utils';

export type User = components['schemas']['UserEntity'];
export type Clinic = components['schemas']['ClinicEntity'];
export type Patient = components['schemas']['PatientEntity'];
export type Service = components['schemas']['ServiceEntity'];

export const LoginFormSchema = z.object({
  email: z.email({ error: 'Informe um e-mail válido.' }).trim(),
  password: z.string().min(1, { error: 'Informe a senha.' }),
});

export const SignupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'O nome deve ter pelo menos 2 caracteres.' })
    .max(120, { error: 'O nome deve ter no máximo 120 caracteres.' }),
  email: z.email({ error: 'Informe um e-mail válido.' }).trim(),
  password: z
    .string()
    .min(12, { error: 'A senha deve ter pelo menos 12 caracteres.' })
    .max(128, { error: 'A senha deve ter no máximo 128 caracteres.' }),
});

export const ForgotPasswordFormSchema = z.object({
  email: z.email({ error: 'Informe um e-mail válido.' }).trim(),
});

export const ResetPasswordFormSchema = z.object({
  token: z.string().min(1, { error: 'Link inválido. Peça um novo link.' }),
  password: z
    .string()
    .min(12, { error: 'A senha deve ter pelo menos 12 caracteres.' })
    .max(128, { error: 'A senha deve ter no máximo 128 caracteres.' }),
});

const optionalText = (max: number, error: string) =>
  z
    .string()
    .trim()
    .max(max, { error })
    .transform((value) => value || null);

const optionalDigits = (pattern: RegExp, error: string) =>
  z
    .string()
    .transform(onlyDigits)
    .refine((value) => !value || pattern.test(value), { error })
    .transform((value) => value || null);

const optionalTime = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$|^$/, {
    error: 'Informe um horário válido.',
  })
  .transform((value) => value || null);

export const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

export const WEEK_DAYS = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb',
] as const;

const optionalPhone = optionalDigits(
  /^\d{10,11}$/,
  'Informe o telefone com DDD (10 ou 11 dígitos).',
);

const optionalEmail = z
  .union([z.email({ error: 'Informe um e-mail válido.' }), z.literal('')])
  .transform((value) => value || null);

const addressShape = {
  zipCode: optionalDigits(/^\d{8}$/, 'O CEP deve ter 8 dígitos.'),
  street: optionalText(120, 'A rua deve ter no máximo 120 caracteres.'),
  streetNumber: optionalText(20, 'O número deve ter no máximo 20 caracteres.'),
  neighborhood: optionalText(80, 'O bairro deve ter no máximo 80 caracteres.'),
  addressComplement: optionalText(
    80,
    'O complemento deve ter no máximo 80 caracteres.',
  ),
  city: optionalText(80, 'A cidade deve ter no máximo 80 caracteres.'),
  state: z
    .union([z.enum(UFS, { error: 'Selecione uma UF válida.' }), z.literal('')])
    .transform((value) => value || null),
};

export const ClinicFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { error: 'Informe o nome da clínica.' })
      .max(120, { error: 'O nome deve ter no máximo 120 caracteres.' }),
    cnpj: z
      .string()
      .transform(onlyDigits)
      .refine(isValidCnpj, { error: 'Informe um CNPJ válido.' }),
    description: optionalText(
      500,
      'A descrição deve ter no máximo 500 caracteres.',
    ),
    phone: optionalPhone,
    contactEmail: optionalEmail,
    ...addressShape,
    openingTime: optionalTime,
    closingTime: optionalTime,
    workingDays: z.array(z.coerce.number().int().min(0).max(6)),
  })
  .superRefine(({ openingTime, closingTime }, ctx) => {
    if (!openingTime !== !closingTime) {
      ctx.addIssue({
        code: 'custom',
        path: [openingTime ? 'closingTime' : 'openingTime'],
        message: 'Informe a abertura e o fechamento juntos.',
      });
    } else if (openingTime && closingTime && openingTime >= closingTime) {
      ctx.addIssue({
        code: 'custom',
        path: ['closingTime'],
        message: 'O fechamento deve ser depois da abertura.',
      });
    }
  });

export const SEX_OPTIONS = ['Feminino', 'Masculino', 'Outro'] as const;

export const PatientFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, { error: 'Informe o nome do paciente.' })
    .max(120, { error: 'O nome deve ter no máximo 120 caracteres.' }),
  cpf: z
    .string()
    .transform(onlyDigits)
    .refine(isValidCpf, { error: 'Informe um CPF válido.' }),
  sex: optionalText(20, 'Selecione uma opção válida.'),
  dateOfBirth: z
    .string()
    .refine(
      (value) =>
        !value ||
        (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
          value <= new Date().toISOString().slice(0, 10)),
      { error: 'Informe uma data de nascimento válida.' },
    )
    .transform((value) => value || null),
  email: optionalEmail,
  phone: optionalPhone,
  notes: optionalText(
    2000,
    'As observações devem ter no máximo 2000 caracteres.',
  ),
  ...addressShape,
});

export type PatientField = keyof z.input<typeof PatientFormSchema>;

export const ServiceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Informe o nome do serviço.' })
    .max(120, { error: 'O nome deve ter no máximo 120 caracteres.' }),
  description: optionalText(
    500,
    'A descrição deve ter no máximo 500 caracteres.',
  ),
  price: z
    .string()
    .transform(parseCurrencyToCents)
    .refine((cents) => Number.isFinite(cents) && cents >= 0, {
      error: 'Informe o preço em reais, por exemplo 150,00.',
    }),
  durationMinutes: z.coerce
    .number({ error: 'Informe a duração em minutos.' })
    .int({ error: 'Informe a duração em minutos inteiros.' })
    .min(5, { error: 'A duração mínima é de 5 minutos.' })
    .max(720, { error: 'A duração máxima é de 720 minutos (12 horas).' }),
  active: z.string().transform((value) => value === 'on'),
});

export type ServiceField = keyof z.input<typeof ServiceFormSchema>;

export type AddressField = keyof typeof addressShape;

export type ClinicField = keyof z.input<typeof ClinicFormSchema>;

export type FormState<Field extends string = string> =
  | {
      errors?: Partial<Record<Field, string[]>>;
      message?: string;
      values?: Partial<Record<Field, string>>;
    }
  | undefined;

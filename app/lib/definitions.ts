import * as z from 'zod';
import type { components } from '@/app/lib/api-schema';
import {
  isValidCnpj,
  isValidCpf,
  onlyDigits,
  parseCurrencyToCents,
  parseDecimal,
} from '@/app/lib/utils';

export type User = components['schemas']['UserEntity'];
export type Clinic = components['schemas']['ClinicEntity'];
export type Patient = components['schemas']['PatientEntity'];
export type Service = components['schemas']['ServiceEntity'];
export type Appointment = components['schemas']['AppointmentEntity'];
export type AppointmentStatus = Appointment['status'];

export const APPOINTMENT_STATUS: Record<
  AppointmentStatus,
  { label: string; color: 'brand' | 'gray' | 'success' | 'danger' | 'warning' }
> = {
  SCHEDULED: { label: 'Agendado', color: 'brand' },
  CONFIRMED: { label: 'Confirmado', color: 'warning' },
  COMPLETED: { label: 'Concluído', color: 'success' },
  CANCELED: { label: 'Cancelado', color: 'gray' },
  NO_SHOW: { label: 'Faltou', color: 'danger' },
};

export type AppointmentDetail =
  components['schemas']['AppointmentDetailEntity'];
export type PaymentMethod = NonNullable<
  components['schemas']['CompleteAppointmentDto']['paymentMethod']
>;

export const PAYMENT_METHODS: Record<
  PaymentMethod,
  { label: string; description: string }
> = {
  PIX: { label: 'Pix', description: 'Recebido na hora' },
  CASH: { label: 'Dinheiro', description: 'Pago no balcão' },
  DEBIT_CARD: { label: 'Cartão de débito', description: 'Pago na maquininha' },
  CREDIT_CARD: {
    label: 'Cartão de crédito',
    description: 'Pago na maquininha',
  },
  BANK_TRANSFER: { label: 'Transferência', description: 'TED ou DOC' },
  BANK_SLIP: { label: 'Boleto', description: 'Compensado em até 3 dias úteis' },
};

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

export type Transaction = components['schemas']['TransactionEntity'];
export type TransactionType = Transaction['type'];
export type TransactionCategory = Transaction['category'];
export type TransactionStatus = Transaction['status'];

export const TRANSACTION_TYPES: Record<
  TransactionType,
  { label: string; plural: string }
> = {
  INCOME: { label: 'Receita', plural: 'Receitas' },
  EXPENSE: { label: 'Despesa', plural: 'Despesas' },
};

export const TRANSACTION_CATEGORIES: Record<
  TransactionType,
  Partial<Record<TransactionCategory, string>>
> = {
  INCOME: {
    SERVICE: 'Atendimento',
    PRODUCT_SALE: 'Venda de produto',
    OTHER: 'Outras receitas',
  },
  EXPENSE: {
    SUPPLIES: 'Insumos',
    RENT: 'Aluguel',
    UTILITIES: 'Contas (água, luz, internet)',
    TAXES: 'Impostos',
    EQUIPMENT: 'Equipamentos',
    MARKETING: 'Divulgação',
    OTHER: 'Outras despesas',
  },
};

export function categoryLabel(
  type: TransactionType,
  category: TransactionCategory,
) {
  return TRANSACTION_CATEGORIES[type][category] ?? category;
}

export const TRANSACTION_STATUS: Record<
  TransactionStatus,
  { label: string; color: 'success' | 'warning' | 'gray' }
> = {
  PAID: { label: 'Pago', color: 'success' },
  PENDING: { label: 'Pendente', color: 'warning' },
  CANCELED: { label: 'Cancelado', color: 'gray' },
};

const PAYMENT_METHOD_VALUES = [
  'PIX',
  'CASH',
  'DEBIT_CARD',
  'CREDIT_CARD',
  'BANK_TRANSFER',
  'BANK_SLIP',
] as const;

const transactionShape = {
  category: z.string().min(1, { error: 'Escolha a categoria.' }),
  description: optionalText(
    500,
    'A descrição deve ter no máximo 500 caracteres.',
  ),
  amount: z
    .string()
    .transform(parseCurrencyToCents)
    .refine((cents) => Number.isFinite(cents) && cents >= 1, {
      error: 'Informe o valor em reais, por exemplo 150,00.',
    }),
  dueDate: z.iso.date({ error: 'Informe a data de vencimento.' }),
};

export const TransactionFormSchema = z
  .object({
    type: z.enum(['INCOME', 'EXPENSE'], { error: 'Escolha o tipo.' }),
    ...transactionShape,
    paid: z.string().transform((value) => value === 'on'),
    paymentMethod: z.string(),
  })
  .superRefine(({ type, category, paid, paymentMethod }, ctx) => {
    if (!(category in TRANSACTION_CATEGORIES[type])) {
      ctx.addIssue({
        code: 'custom',
        path: ['category'],
        message: 'Escolha uma categoria deste tipo.',
      });
    }
    if (
      paid &&
      !PAYMENT_METHOD_VALUES.includes(
        paymentMethod as (typeof PAYMENT_METHOD_VALUES)[number],
      )
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['paymentMethod'],
        message: 'Escolha a forma de pagamento.',
      });
    }
  });

export const TransactionUpdateSchema = z.object(transactionShape);

export type TransactionField = keyof z.input<typeof TransactionFormSchema>;

export type Supply = components['schemas']['SupplyEntity'];
export type StockMovement = components['schemas']['StockMovementEntity'];
export type StockMovementType = StockMovement['type'];

export const STOCK_MOVEMENT_TYPES: Record<
  StockMovementType,
  { label: string; description: string }
> = {
  IN: { label: 'Entrada', description: 'Compra ou reposição' },
  OUT: { label: 'Saída', description: 'Uso em atendimento, perda, vencimento' },
  ADJUSTMENT: {
    label: 'Ajuste',
    description: 'Correção de contagem (use − para reduzir)',
  },
};

export const SupplyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Informe o nome do insumo.' })
    .max(120, { error: 'O nome deve ter no máximo 120 caracteres.' }),
  description: optionalText(
    500,
    'A descrição deve ter no máximo 500 caracteres.',
  ),
  unit: z
    .string()
    .trim()
    .min(1, { error: 'Informe a unidade (ex.: un, cx, ml).' })
    .max(20, { error: 'A unidade deve ter no máximo 20 caracteres.' }),
  minQuantity: z
    .string()
    .transform((value) => (value.trim() ? parseDecimal(value) : 0))
    .refine((value) => Number.isFinite(value) && value >= 0, {
      error: 'Informe o estoque mínimo, por exemplo 10 ou 2,5.',
    }),
  unitCost: z
    .string()
    .transform((value) => (value.trim() ? parseCurrencyToCents(value) : null))
    .refine((value) => value === null || Number.isFinite(value), {
      error: 'Informe o custo em reais, por exemplo 12,90.',
    }),
  active: z.string().transform((value) => value === 'on'),
});

export type SupplyField = keyof z.input<typeof SupplyFormSchema>;

export const MovementFormSchema = z
  .object({
    type: z.enum(['IN', 'OUT', 'ADJUSTMENT'], {
      error: 'Escolha o tipo de movimentação.',
    }),
    quantity: z
      .string()
      .transform(parseDecimal)
      .refine((value) => Number.isFinite(value) && value !== 0, {
        error: 'Informe a quantidade, por exemplo 5 ou 2,5.',
      }),
    unitCost: z
      .string()
      .transform((value) => (value.trim() ? parseCurrencyToCents(value) : null))
      .refine((value) => value === null || Number.isFinite(value), {
        error: 'Informe o custo em reais, por exemplo 12,90.',
      }),
    reason: optionalText(500, 'O motivo deve ter no máximo 500 caracteres.'),
    registerExpense: z.string().transform((value) => value === 'on'),
    paymentMethod: z.string(),
  })
  .superRefine(({ type, quantity, unitCost, registerExpense }, ctx) => {
    if (type !== 'ADJUSTMENT' && quantity < 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['quantity'],
        message: 'Use uma quantidade positiva; o tipo define se entra ou sai.',
      });
    }
    if (type === 'IN' && registerExpense && unitCost === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['unitCost'],
        message: 'Informe o custo unitário para lançar a despesa.',
      });
    }
  });

export type MovementField = keyof z.input<typeof MovementFormSchema>;

export type AddressField = keyof typeof addressShape;

export type ClinicField = keyof z.input<typeof ClinicFormSchema>;

export type FormState<Field extends string = string> =
  | {
      errors?: Partial<Record<Field, string[]>>;
      message?: string;
      values?: Partial<Record<Field, string>>;
    }
  | undefined;

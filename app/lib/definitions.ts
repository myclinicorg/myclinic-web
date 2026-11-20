import * as z from 'zod';
import type { components } from '@/app/lib/api-schema';

export type User = components['schemas']['UserEntity'];

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

export type FormState<Field extends string = string> =
  | {
      errors?: Partial<Record<Field, string[]>>;
      message?: string;
    }
  | undefined;

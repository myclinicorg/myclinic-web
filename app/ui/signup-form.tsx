'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signup } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { TextField } from '@/app/ui/form-fields';

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField
        id="name"
        name="name"
        label="Nome"
        placeholder="Seu nome completo"
        autoComplete="name"
        defaultValue={state?.values?.name}
        errors={state?.errors?.name}
        required
      />
      <TextField
        id="email"
        name="email"
        type="email"
        label="E-mail"
        placeholder="voce@exemplo.com"
        autoComplete="email"
        defaultValue={state?.values?.email}
        errors={state?.errors?.email}
        required
      />
      <TextField
        id="password"
        name="password"
        type="password"
        label="Senha"
        helperText="Pelo menos 12 caracteres."
        autoComplete="new-password"
        errors={state?.errors?.password}
        required
      />
      {state?.message && (
        <p aria-live="polite" className="text-body-s text-error-solid">
          {state.message}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        Criar conta
      </Button>
      <p className="text-body-s text-center text-neutral-600">
        Já tem conta?{' '}
        <Link href="/login" className="text-brand-700 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}

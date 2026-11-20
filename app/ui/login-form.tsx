'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { TextField } from '@/app/ui/form-fields';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
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
        autoComplete="current-password"
        errors={state?.errors?.password}
        required
      />
      {state?.message && (
        <p aria-live="polite" className="text-body-s text-error-solid">
          {state.message}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        Entrar
      </Button>
      <p className="text-body-s text-center text-neutral-600">
        Ainda não tem conta?{' '}
        <Link href="/signup" className="text-brand-700 hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}

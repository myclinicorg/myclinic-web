'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { AuthFooter } from '@/app/ui/auth-card';
import { Button } from '@/app/ui/button';
import { TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import PasswordField from '@/app/ui/password-field';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
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
        <PasswordField
          id="password"
          name="password"
          label="Senha"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          errors={state?.errors?.password}
          required
        />
        <div className="flex justify-end">
          <Link
            href="/esqueci-a-senha"
            className="text-body-m text-brand-700 hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <FormMessage>{state?.message}</FormMessage>
      </div>
      <Button type="submit" size="l" className="w-full" disabled={isPending}>
        Entrar
      </Button>
      <AuthFooter
        text="Ainda não tem conta?"
        linkLabel="Criar conta"
        href="/cadastro"
      />
    </form>
  );
}

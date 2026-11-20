'use client';

import { useActionState } from 'react';
import { signup } from '@/app/lib/actions';
import { AuthFooter } from '@/app/ui/auth-card';
import { Button } from '@/app/ui/button';
import { TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import PasswordField from '@/app/ui/password-field';

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
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
        <PasswordField
          id="password"
          name="password"
          label="Senha"
          placeholder="Crie uma senha"
          helperText="Pelo menos 12 caracteres."
          autoComplete="new-password"
          errors={state?.errors?.password}
          required
        />
        <FormMessage>{state?.message}</FormMessage>
      </div>
      <Button type="submit" size="l" className="w-full" disabled={isPending}>
        Criar conta
      </Button>
      <AuthFooter text="Já tem conta?" linkLabel="Entrar" href="/entrar" />
    </form>
  );
}

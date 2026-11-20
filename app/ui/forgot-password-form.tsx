'use client';

import { useActionState } from 'react';
import { requestPasswordReset } from '@/app/lib/actions';
import { AuthFooter } from '@/app/ui/auth-card';
import { Button } from '@/app/ui/button';
import { TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
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
        <FormMessage tone={state?.sent ? 'success' : 'error'}>
          {state?.message}
        </FormMessage>
      </div>
      <Button type="submit" size="l" className="w-full" disabled={isPending}>
        Enviar link
      </Button>
      <AuthFooter text="Lembrou a senha?" linkLabel="Entrar" href="/entrar" />
    </form>
  );
}

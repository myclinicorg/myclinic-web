'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { resetPassword } from '@/app/lib/actions';
import { AuthFooter } from '@/app/ui/auth-card';
import { Button } from '@/app/ui/button';
import FormMessage from '@/app/ui/form-message';
import PasswordField from '@/app/ui/password-field';

export default function ResetPasswordForm() {
  const token = useSearchParams().get('token') ?? '';
  const [state, formAction, isPending] = useActionState(
    resetPassword,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-col gap-4">
        <PasswordField
          id="password"
          name="password"
          label="Nova senha"
          placeholder="Crie uma nova senha"
          helperText="Pelo menos 12 caracteres."
          autoComplete="new-password"
          errors={state?.errors?.password}
          required
        />
        <FormMessage>{state?.message ?? state?.errors?.token?.[0]}</FormMessage>
      </div>
      <Button type="submit" size="l" className="w-full" disabled={isPending}>
        Salvar nova senha
      </Button>
      <AuthFooter
        text="Link vencido?"
        linkLabel="Pedir outro"
        href="/esqueci-a-senha"
      />
    </form>
  );
}

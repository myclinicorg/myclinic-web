import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthCard from '@/app/ui/auth-card';
import ResetPasswordForm from '@/app/ui/reset-password-form';

export const metadata: Metadata = {
  title: 'Redefinir senha',
};

export default function Page() {
  return (
    <AuthCard
      title="Crie uma nova senha"
      description="Escolha uma senha que você ainda não usou nesta conta."
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}

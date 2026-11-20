import type { Metadata } from 'next';
import AuthCard from '@/app/ui/auth-card';
import ForgotPasswordForm from '@/app/ui/forgot-password-form';

export const metadata: Metadata = {
  title: 'Esqueci a senha',
};

export default function Page() {
  return (
    <AuthCard
      title="Esqueceu a senha?"
      description="Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}

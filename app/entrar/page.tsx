import type { Metadata } from 'next';
import AuthCard from '@/app/ui/auth-card';
import LoginForm from '@/app/ui/login-form';

export const metadata: Metadata = {
  title: 'Entrar',
};

export default function Page() {
  return (
    <AuthCard
      title="Bem-vindo de volta"
      description="Entre para acessar a gestão da sua clínica."
    >
      <LoginForm />
    </AuthCard>
  );
}

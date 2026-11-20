import type { Metadata } from 'next';
import AuthCard from '@/app/ui/auth-card';
import LoginForm from '@/app/ui/login-form';

export const metadata: Metadata = {
  title: 'Entrar',
};

export default function LoginPage() {
  return (
    <AuthCard title="Entrar" description="Acesse a gestão da sua clínica.">
      <LoginForm />
    </AuthCard>
  );
}

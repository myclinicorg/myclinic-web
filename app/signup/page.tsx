import type { Metadata } from 'next';
import AuthCard from '@/app/ui/auth-card';
import SignupForm from '@/app/ui/signup-form';

export const metadata: Metadata = {
  title: 'Criar conta',
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Criar conta"
      description="Organize pacientes, agenda, estoque e caixa em um só lugar."
    >
      <SignupForm />
    </AuthCard>
  );
}

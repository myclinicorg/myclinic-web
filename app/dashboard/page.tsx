import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCurrentUser } from '@/app/lib/dal';
import PageHeader from '@/app/ui/page-header';
import { TextSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Visão geral',
};

async function Welcome() {
  const user = await getCurrentUser();
  const [firstName] = user.name.split(' ');
  return (
    <PageHeader
      title="Visão geral"
      description={`Olá, ${firstName}. Este é o resumo da sua clínica.`}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<TextSkeleton />}>
      <Welcome />
    </Suspense>
  );
}

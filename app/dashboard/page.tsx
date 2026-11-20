import type { Metadata } from 'next';
import { Suspense } from 'react';
import { logout } from '@/app/lib/actions';
import { getCurrentUser } from '@/app/lib/dal';
import { Button } from '@/app/ui/button';
import { TextSkeleton } from '@/app/ui/skeletons';

export const metadata: Metadata = {
  title: 'Painel',
};

async function Greeting() {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-heading-3 text-neutral-900">Olá, {user.name}</h1>
      <p className="text-body-m text-neutral-600">{user.email}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="flex flex-col gap-6 p-8">
      <Suspense fallback={<TextSkeleton />}>
        <Greeting />
      </Suspense>
      <form action={logout}>
        <Button type="submit" hierarchy="secondary">
          Sair
        </Button>
      </form>
    </main>
  );
}

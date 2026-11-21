'use client';

import { RiErrorWarningLine } from '@remixicon/react';
import { Button } from '@/app/ui/button';
import EmptyState from '@/app/ui/empty-state';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <EmptyState
      icon={RiErrorWarningLine}
      title="Algo deu errado"
      description="Não foi possível carregar o caixa."
    >
      <Button onClick={reset}>Tentar novamente</Button>
    </EmptyState>
  );
}

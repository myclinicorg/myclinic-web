import { RiFileSearchLine } from '@remixicon/react';
import Link from 'next/link';
import { buttonClasses } from '@/app/ui/button';
import EmptyState from '@/app/ui/empty-state';

export default function NotFound() {
  return (
    <EmptyState
      icon={RiFileSearchLine}
      title="Lançamento não encontrado"
      description="Ele pode ter sido cancelado ou o link está incorreto."
    >
      <Link href="/painel/caixa" className={buttonClasses()}>
        Voltar para o caixa
      </Link>
    </EmptyState>
  );
}

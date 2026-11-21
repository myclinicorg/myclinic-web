import { RiCalendarCloseLine } from '@remixicon/react';
import Link from 'next/link';
import { buttonClasses } from '@/app/ui/button';
import EmptyState from '@/app/ui/empty-state';

export default function NotFound() {
  return (
    <EmptyState
      icon={RiCalendarCloseLine}
      title="Atendimento não encontrado"
      description="O link pode estar incorreto ou o atendimento é de outra clínica."
    >
      <Link href="/painel/agenda" className={buttonClasses()}>
        Voltar para a agenda
      </Link>
    </EmptyState>
  );
}

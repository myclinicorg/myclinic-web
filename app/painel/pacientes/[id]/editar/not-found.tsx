import { RiUserSearchLine } from '@remixicon/react';
import Link from 'next/link';
import { buttonClasses } from '@/app/ui/button';
import EmptyState from '@/app/ui/empty-state';

export default function NotFound() {
  return (
    <EmptyState
      icon={RiUserSearchLine}
      title="Paciente não encontrado"
      description="Ele pode ter sido excluído ou o link está incorreto."
    >
      <Link href="/painel/pacientes" className={buttonClasses()}>
        Voltar para pacientes
      </Link>
    </EmptyState>
  );
}

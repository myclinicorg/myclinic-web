import { RiAddLine } from '@remixicon/react';
import Link from 'next/link';
import { deleteService } from '@/app/lib/actions';
import { buttonClasses } from '@/app/ui/button';
import { RowMenu } from '@/app/ui/row-actions';

export function CreateService({ size = 'm' }: { size?: 's' | 'm' }) {
  return (
    <Link href="/painel/servicos/novo" className={buttonClasses({ size })}>
      <RiAddLine aria-hidden />
      Novo serviço
    </Link>
  );
}

export function ServiceActions({
  id,
  name,
  variant,
}: {
  id: string;
  name: string;
  variant: 'menu' | 'sheet';
}) {
  return (
    <RowMenu
      variant={variant}
      name={name}
      editHref={`/painel/servicos/${id}/editar`}
      deleteAction={deleteService.bind(null, id)}
      deleteTitle="Excluir serviço"
    />
  );
}

import { RiAddLine } from '@remixicon/react';
import Link from 'next/link';
import { deleteService } from '@/app/lib/actions';
import { buttonClasses } from '@/app/ui/button';
import { DeleteButton, EditLink } from '@/app/ui/row-actions';

export function CreateService() {
  return (
    <Link href="/painel/servicos/novo" className={buttonClasses()}>
      <RiAddLine aria-hidden />
      Novo serviço
    </Link>
  );
}

export function UpdateService({ id, name }: { id: string; name: string }) {
  return (
    <EditLink href={`/painel/servicos/${id}/editar`} label={`Editar ${name}`} />
  );
}

export function DeleteService({ id, name }: { id: string; name: string }) {
  return (
    <DeleteButton
      action={deleteService.bind(null, id)}
      title="Excluir serviço"
      name={name}
    />
  );
}

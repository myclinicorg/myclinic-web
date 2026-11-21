import { RiAddLine } from '@remixicon/react';
import Link from 'next/link';
import { deleteSupply } from '@/app/lib/actions';
import { buttonClasses } from '@/app/ui/button';
import { DeleteButton, RowMenu } from '@/app/ui/row-actions';

export function CreateSupply({ size = 'm' }: { size?: 's' | 'm' }) {
  return (
    <Link href="/painel/estoque/novo" className={buttonClasses({ size })}>
      <RiAddLine aria-hidden />
      Novo insumo
    </Link>
  );
}

export function SupplyActions({
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
      viewHref={`/painel/estoque/${id}`}
      editHref={`/painel/estoque/${id}/editar`}
      deleteAction={deleteSupply.bind(null, id, undefined)}
      deleteTitle="Excluir insumo"
    />
  );
}

export function DeleteSupply({ id, name }: { id: string; name: string }) {
  return (
    <DeleteButton
      action={deleteSupply.bind(null, id, '/painel/estoque')}
      title="Excluir insumo"
      name={name}
    />
  );
}

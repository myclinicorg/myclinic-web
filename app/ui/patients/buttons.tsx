import { RiAddLine } from '@remixicon/react';
import Link from 'next/link';
import { deletePatient } from '@/app/lib/actions';
import { buttonClasses } from '@/app/ui/button';
import { DeleteButton, RowMenu } from '@/app/ui/row-actions';

export function CreatePatient({ size = 'm' }: { size?: 's' | 'm' }) {
  return (
    <Link href="/painel/pacientes/novo" className={buttonClasses({ size })}>
      <RiAddLine aria-hidden />
      Novo paciente
    </Link>
  );
}

export function PatientActions({
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
      viewHref={`/painel/pacientes/${id}`}
      editHref={`/painel/pacientes/${id}/editar`}
      deleteAction={deletePatient.bind(null, id, undefined)}
      deleteTitle="Excluir paciente"
    />
  );
}

export function DeletePatient({
  id,
  name,
  redirectTo,
}: {
  id: string;
  name: string;
  redirectTo?: string;
}) {
  return (
    <DeleteButton
      action={deletePatient.bind(null, id, redirectTo)}
      title="Excluir paciente"
      name={name}
    />
  );
}

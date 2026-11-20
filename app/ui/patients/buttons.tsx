import { RiAddLine } from '@remixicon/react';
import Link from 'next/link';
import { deletePatient } from '@/app/lib/actions';
import { buttonClasses } from '@/app/ui/button';
import { DeleteButton, EditLink } from '@/app/ui/row-actions';

export function CreatePatient({ size = 'm' }: { size?: 's' | 'm' }) {
  return (
    <Link href="/painel/pacientes/novo" className={buttonClasses({ size })}>
      <RiAddLine aria-hidden />
      Novo paciente
    </Link>
  );
}

export function UpdatePatient({ id, name }: { id: string; name: string }) {
  return (
    <EditLink
      href={`/painel/pacientes/${id}/editar`}
      label={`Editar ${name}`}
    />
  );
}

export function DeletePatient({
  id,
  name,
  redirectTo,
  variant,
}: {
  id: string;
  name: string;
  redirectTo?: string;
  variant?: 'icon' | 'button';
}) {
  return (
    <DeleteButton
      variant={variant}
      action={deletePatient.bind(null, id, redirectTo)}
      title="Excluir paciente"
      name={name}
    />
  );
}

import { RiAddLine } from '@remixicon/react';
import Link from 'next/link';
import { deletePatient } from '@/app/lib/actions';
import { buttonClasses } from '@/app/ui/button';
import { DeleteButton, EditLink } from '@/app/ui/row-actions';

export function CreatePatient() {
  return (
    <Link href="/painel/pacientes/novo" className={buttonClasses()}>
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

export function DeletePatient({ id, name }: { id: string; name: string }) {
  return (
    <DeleteButton
      action={deletePatient.bind(null, id)}
      title="Excluir paciente"
      name={name}
    />
  );
}

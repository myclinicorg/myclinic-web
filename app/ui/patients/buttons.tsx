'use client';

import { RiAddLine, RiDeleteBinLine, RiEditLine } from '@remixicon/react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { deletePatient } from '@/app/lib/actions';
import { Button, buttonClasses } from '@/app/ui/button';
import FormMessage from '@/app/ui/form-message';
import { Modal } from '@/app/ui/modal';

const iconButton =
  'flex size-10 items-center justify-center text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-brand-700';

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
    <Link
      href={`/painel/pacientes/${id}/editar`}
      aria-label={`Editar ${name}`}
      title="Editar"
      className={iconButton}
    >
      <RiEditLine aria-hidden className="size-5" />
    </Link>
  );
}

export function DeletePatient({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    deletePatient.bind(null, id),
    undefined,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Excluir ${name}`}
        title="Excluir"
        className={iconButton}
      >
        <RiDeleteBinLine aria-hidden className="size-5" />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Excluir paciente"
        footer={
          <>
            <Button
              hierarchy="secondary"
              color="gray"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <form action={formAction}>
              <Button type="submit" color="danger" disabled={isPending}>
                Excluir
              </Button>
            </form>
          </>
        }
      >
        <p>
          Excluir <strong className="font-medium">{name}</strong>? Esta ação não
          pode ser desfeita.
        </p>
        <FormMessage>{state?.message}</FormMessage>
      </Modal>
    </>
  );
}

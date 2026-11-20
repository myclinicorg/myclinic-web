'use client';

import { RiDeleteBinLine, RiEditLine } from '@remixicon/react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import type { DeleteState } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import FormMessage from '@/app/ui/form-message';
import { Modal } from '@/app/ui/modal';

const iconButton =
  'flex size-10 items-center justify-center text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-brand-700';

export function EditLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} aria-label={label} title="Editar" className={iconButton}>
      <RiEditLine aria-hidden className="size-5" />
    </Link>
  );
}

export function DeleteButton({
  action,
  title,
  name,
}: {
  action: () => Promise<DeleteState>;
  title: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(action, undefined);

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
        title={title}
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

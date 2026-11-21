'use client';

import {
  RiCheckDoubleLine,
  RiCheckLine,
  RiCalendarScheduleLine,
  RiCloseCircleLine,
  RiUserUnfollowLine,
} from '@remixicon/react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  type AppointmentActionState,
  cancelAppointment,
  confirmAppointment,
  markNoShow,
} from '@/app/lib/actions';
import type { AppointmentStatus } from '@/app/lib/definitions';
import { Button, buttonClasses } from '@/app/ui/button';
import { TextareaField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import { Modal } from '@/app/ui/modal';

function ConfirmButton({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState<AppointmentActionState>(
    confirmAppointment.bind(null, id),
    undefined,
  );
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Button
        type="submit"
        hierarchy="secondary"
        color="gray"
        disabled={isPending}
      >
        <RiCheckLine aria-hidden />
        Confirmar
      </Button>
      <FormMessage>{state?.message}</FormMessage>
    </form>
  );
}

function NoShowButton({ id, patient }: { id: string; patient: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<AppointmentActionState>(
    markNoShow.bind(null, id),
    undefined,
  );
  return (
    <>
      <Button hierarchy="secondary" color="gray" onClick={() => setOpen(true)}>
        <RiUserUnfollowLine aria-hidden />
        Faltou
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Registrar falta"
        footer={
          <>
            <Button
              hierarchy="secondary"
              color="gray"
              onClick={() => setOpen(false)}
            >
              Voltar
            </Button>
            <form action={formAction}>
              <Button type="submit" color="danger" disabled={isPending}>
                Registrar falta
              </Button>
            </form>
          </>
        }
      >
        <p>
          Registrar que <strong className="font-medium">{patient}</strong> não
          compareceu? O horário volta a ficar livre na agenda.
        </p>
        <FormMessage>{state?.message}</FormMessage>
      </Modal>
    </>
  );
}

function CancelButton({ id, patient }: { id: string; patient: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<
    AppointmentActionState,
    FormData
  >(cancelAppointment.bind(null, id), undefined);
  return (
    <>
      <Button hierarchy="tertiary" color="danger" onClick={() => setOpen(true)}>
        <RiCloseCircleLine aria-hidden />
        Cancelar
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cancelar atendimento"
        size="m"
        footer={
          <>
            <Button
              hierarchy="secondary"
              color="gray"
              onClick={() => setOpen(false)}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              form={`cancel-${id}`}
              color="danger"
              disabled={isPending}
            >
              Cancelar atendimento
            </Button>
          </>
        }
      >
        <form
          id={`cancel-${id}`}
          action={formAction}
          className="flex flex-col gap-4"
        >
          <p>
            O atendimento de <strong className="font-medium">{patient}</strong>{' '}
            será cancelado e o horário ficará livre.
          </p>
          <TextareaField
            id={`reason-${id}`}
            name="reason"
            label="Motivo (opcional)"
            placeholder="Ex.: paciente pediu para remarcar"
            maxLength={500}
            rows={3}
          />
          <FormMessage>{state?.message}</FormMessage>
        </form>
      </Modal>
    </>
  );
}

export default function AppointmentActions({
  id,
  status,
  patient,
}: {
  id: string;
  status: AppointmentStatus;
  patient: string;
}) {
  if (status !== 'SCHEDULED' && status !== 'CONFIRMED') {
    return null;
  }
  return (
    <div className="flex flex-wrap items-start gap-3">
      <CancelButton id={id} patient={patient} />
      <NoShowButton id={id} patient={patient} />
      <Link
        href={`/painel/agenda/${id}/remarcar`}
        className={buttonClasses({ hierarchy: 'secondary', color: 'gray' })}
      >
        <RiCalendarScheduleLine aria-hidden />
        Remarcar
      </Link>
      {status === 'SCHEDULED' && <ConfirmButton id={id} />}
      <Link href={`/painel/agenda/${id}/concluir`} className={buttonClasses()}>
        <RiCheckDoubleLine aria-hidden />
        Concluir
      </Link>
    </div>
  );
}

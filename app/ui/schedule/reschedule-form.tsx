'use client';

import { RiCalendarScheduleLine } from '@remixicon/react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  type AppointmentActionState,
  rescheduleAppointment,
} from '@/app/lib/actions';
import type { AppointmentDetail } from '@/app/lib/definitions';
import {
  type BookingRules,
  formatMinutes,
  localDay,
  localMinutes,
  longDate,
  timeRange,
} from '@/app/lib/schedule';
import { Button, buttonClasses } from '@/app/ui/button';
import FormMessage from '@/app/ui/form-message';
import SlotPicker from '@/app/ui/schedule/slot-picker';

export default function RescheduleForm({
  appointment,
  rules,
}: {
  appointment: AppointmentDetail;
  rules: BookingRules;
}) {
  const [state, formAction, isPending] = useActionState<
    AppointmentActionState,
    FormData
  >(rescheduleAppointment.bind(null, appointment.id), undefined);
  const duration =
    localMinutes(appointment.endsAt) - localMinutes(appointment.startsAt);
  const currentDay = localDay(appointment.startsAt);
  const [day, setDay] = useState(
    currentDay >= rules.today ? currentDay : undefined,
  );
  const [time, setTime] = useState<string>();
  const [handledState, setHandledState] = useState(state);

  if (state !== handledState) {
    setHandledState(state);
    setTime(undefined);
  }

  const newTime =
    day && time
      ? `${longDate(day)}, ${time} – ${formatMinutes(
          Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) + duration,
        )}`
      : 'Escolha no calendário';

  return (
    <form
      action={formAction}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-start"
    >
      <input
        type="hidden"
        name="startsAt"
        value={day && time ? `${day}T${time}:00-03:00` : ''}
      />
      <section className="flex flex-col gap-5 border border-neutral-100 bg-white p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-5 text-neutral-900">Novo horário</h2>
          <p className="text-body-s text-neutral-600">
            Só aparecem dias e horários livres dentro do expediente.
          </p>
        </div>
        <SlotPicker
          rules={rules}
          duration={duration}
          day={day}
          time={time}
          onDayChange={(value) => {
            setDay(value);
            setTime(undefined);
          }}
          onTimeChange={setTime}
        />
      </section>
      <section className="flex flex-col gap-4 bg-neutral-50 p-6">
        <h2 className="text-heading-6 text-neutral-900">Resumo</h2>
        <dl className="text-body-s flex flex-col gap-3">
          {[
            ['Paciente', appointment.patient.fullName],
            ['Serviço', appointment.service.name],
            [
              'Horário atual',
              `${longDate(currentDay)}, ${timeRange(appointment.startsAt, appointment.endsAt)}`,
            ],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="text-neutral-600">{label}</dt>
              <dd className="text-neutral-900">{value}</dd>
            </div>
          ))}
        </dl>
        <hr className="border-neutral-100" />
        <div className="flex flex-col gap-0.5">
          <p className="text-body-s text-neutral-600">Novo horário</p>
          <p className="text-subtitle-m text-neutral-900">{newTime}</p>
        </div>
        {appointment.status === 'CONFIRMED' && (
          <p className="text-body-s text-neutral-600">
            O atendimento volta para “Agendado” e precisa ser confirmado de
            novo.
          </p>
        )}
        <Button
          type="submit"
          size="l"
          disabled={isPending || !time}
          className="w-full"
        >
          <RiCalendarScheduleLine aria-hidden />
          Remarcar atendimento
        </Button>
        <Link
          href={`/painel/agenda/${appointment.id}`}
          className={`${buttonClasses({ hierarchy: 'secondary', color: 'gray', size: 'l' })} w-full`}
        >
          Voltar
        </Link>
        <FormMessage>{state?.message}</FormMessage>
      </section>
    </form>
  );
}

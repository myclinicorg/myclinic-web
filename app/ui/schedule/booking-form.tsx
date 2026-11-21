'use client';

import {
  RiCalendarLine,
  RiMoneyDollarCircleLine,
  RiSearchLine,
  RiUserLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import Link from 'next/link';
import { startTransition, useActionState, useState } from 'react';
import { type BookingState, createAppointment } from '@/app/lib/actions';
import type { Patient, Service } from '@/app/lib/definitions';
import {
  availableSlots,
  type BookingRules,
  longDate,
  startOfMonth,
} from '@/app/lib/schedule';
import {
  formatCpf,
  formatCurrency,
  formatDuration,
  formatPhone,
  onlyDigits,
} from '@/app/lib/utils';
import { Button, buttonClasses } from '@/app/ui/button';
import { ChipRadio } from '@/app/ui/chip';
import Datepicker from '@/app/ui/datepicker';
import { TextareaField, TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import OptionCard from '@/app/ui/option-card';
import ProgressBar from '@/app/ui/progress-bar';
import Stepper from '@/app/ui/stepper';

const STEPS = [
  { title: 'Paciente', description: 'Quem será atendido' },
  { title: 'Serviço', description: 'O que será feito' },
  { title: 'Data e horário', description: 'Horários livres' },
  { title: 'Confirmar', description: 'Revise e agende' },
];

const MAX_PATIENTS_SHOWN = 30;

function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(':').map(Number);
  const total = hours * 60 + mins + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function SummaryRow({
  icon: Icon,
  title,
  description,
}: {
  icon: RemixiconComponentType;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-center gap-4 border-b border-neutral-100 py-4 last:border-b-0">
      <span className="bg-brand-100 flex size-8 shrink-0 items-center justify-center rounded-full">
        <Icon aria-hidden className="text-brand-700 size-4" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-subtitle-m text-neutral-900">{title}</span>
        <span className="text-body-s text-neutral-600">{description}</span>
      </span>
    </li>
  );
}

function patientDescription(patient: Patient) {
  return [
    formatCpf(patient.cpf),
    patient.phone ? formatPhone(patient.phone) : patient.email,
  ]
    .filter(Boolean)
    .join(' · ');
}

export default function BookingForm({
  patients,
  services,
  rules,
  initialPatientId,
  initialDay,
}: {
  patients: Patient[];
  services: Service[];
  rules: BookingRules;
  initialPatientId?: string;
  initialDay?: string;
}) {
  const [state, formAction, isPending] = useActionState<BookingState, FormData>(
    createAppointment,
    undefined,
  );
  const hasInitialPatient = patients.some(({ id }) => id === initialPatientId);
  const [step, setStep] = useState(hasInitialPatient ? 1 : 0);
  const [patientId, setPatientId] = useState(
    hasInitialPatient ? initialPatientId : undefined,
  );
  const [serviceId, setServiceId] = useState(
    services.length === 1 ? services[0].id : undefined,
  );
  const [day, setDay] = useState(initialDay);
  const [time, setTime] = useState<string>();
  const [notes, setNotes] = useState('');
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState(startOfMonth(initialDay ?? rules.today));
  const [hint, setHint] = useState<string>();
  const [handledState, setHandledState] = useState(state);

  if (state !== handledState) {
    setHandledState(state);
    if (state?.step !== undefined && state.step >= 0) {
      setStep(state.step);
      if (state.step === 2) setTime(undefined);
    }
  }

  const patient = patients.find(({ id }) => id === patientId);
  const service = services.find(({ id }) => id === serviceId);
  const duration = service?.durationMinutes ?? 30;
  const slots = day ? availableSlots(rules, day, duration) : [];
  const progress = Math.round((step / STEPS.length) * 100);

  const term = query.trim().toLowerCase();
  const digits = onlyDigits(query);
  const filteredPatients = patients
    .filter(
      (item) =>
        !term ||
        item.fullName.toLowerCase().includes(term) ||
        (digits.length > 2 && item.cpf.includes(digits)),
    )
    .slice(0, MAX_PATIENTS_SHOWN);

  function handleContinue() {
    const missing = [
      !patientId && 'Escolha o paciente.',
      !serviceId && 'Escolha o serviço.',
      !time && 'Escolha o dia e o horário.',
    ][step];
    if (missing) {
      setHint(missing);
      return;
    }
    setHint(undefined);
    setStep(step + 1);
  }

  function goBack() {
    setHint(undefined);
    setStep(step - 1);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar
        label={`Agendamento ${progress}% concluído`}
        value={progress}
        helperText={`Etapa ${step + 1} de ${STEPS.length} · ${STEPS[step].title}`}
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="hidden border border-neutral-100 bg-white p-6 lg:block lg:w-80 lg:shrink-0">
          <Stepper
            label="Etapas do agendamento"
            current={step}
            steps={STEPS.map((item, index) => ({
              ...item,
              error: index === state?.step && index >= step && !!state.message,
            }))}
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex min-w-0 flex-1 flex-col gap-6 border border-neutral-100 bg-white p-6 sm:p-8"
        >
          <input type="hidden" name="patientId" value={patientId ?? ''} />
          <input type="hidden" name="serviceId" value={serviceId ?? ''} />
          <input
            type="hidden"
            name="startsAt"
            value={day && time ? `${day}T${time}:00-03:00` : ''}
          />

          <section hidden={step !== 0} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-heading-5 text-neutral-900">Paciente</h2>
              <p className="text-body-s text-neutral-600">
                Busque pelo nome ou CPF.
              </p>
            </div>
            <TextField
              id="patient-search"
              aria-label="Buscar paciente"
              placeholder="Nome ou CPF…"
              iconLeft={<RiSearchLine aria-hidden className="size-5" />}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            <div
              role="radiogroup"
              aria-label="Pacientes"
              className="flex max-h-120 flex-col gap-3 overflow-y-auto"
            >
              {filteredPatients.map((item) => (
                <OptionCard
                  key={item.id}
                  name="patientChoice"
                  value={item.id}
                  title={item.fullName}
                  description={patientDescription(item)}
                  checked={item.id === patientId}
                  onChange={() => setPatientId(item.id)}
                />
              ))}
              {filteredPatients.length === 0 && (
                <p className="text-body-s text-neutral-600">
                  Nenhum paciente encontrado.{' '}
                  <Link
                    href="/painel/pacientes/novo"
                    className="text-brand-700 hover:underline"
                  >
                    Cadastrar paciente
                  </Link>
                </p>
              )}
            </div>
          </section>

          <section hidden={step !== 1} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-heading-5 text-neutral-900">Serviço</h2>
              <p className="text-body-s text-neutral-600">
                A duração define os horários disponíveis.
              </p>
            </div>
            <div
              role="radiogroup"
              aria-label="Serviços"
              className="flex flex-col gap-3"
            >
              {services.map((item) => (
                <OptionCard
                  key={item.id}
                  name="serviceChoice"
                  value={item.id}
                  title={item.name}
                  description={formatDuration(item.durationMinutes)}
                  meta={formatCurrency(item.priceCents)}
                  checked={item.id === serviceId}
                  onChange={() => {
                    setServiceId(item.id);
                    setTime(undefined);
                  }}
                />
              ))}
              {services.length === 0 && (
                <p className="text-body-s text-neutral-600">
                  Nenhum serviço ativo.{' '}
                  <Link
                    href="/painel/servicos/novo"
                    className="text-brand-700 hover:underline"
                  >
                    Cadastrar serviço
                  </Link>
                </p>
              )}
            </div>
          </section>

          <section hidden={step !== 2} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-heading-5 text-neutral-900">
                Data e horário
              </h2>
              <p className="text-body-s text-neutral-600">
                Só aparecem dias e horários livres dentro do expediente.
              </p>
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
              <Datepicker
                month={month}
                onMonthChange={setMonth}
                selected={day}
                onSelect={(value) => {
                  setDay(value);
                  setTime(undefined);
                }}
                today={rules.today}
                minMonth={startOfMonth(rules.today)}
                maxMonth={startOfMonth(rules.lastDay)}
                isDisabled={(value) =>
                  availableSlots(rules, value, duration).length === 0
                }
              />
              <fieldset className="flex min-w-0 flex-1 flex-col gap-3">
                <legend className="text-subtitle-m mb-3 text-neutral-900">
                  {day ? `Horários em ${longDate(day)}` : 'Horários'}
                </legend>
                {!day ? (
                  <p className="text-body-s text-neutral-600">
                    Escolha um dia no calendário.
                  </p>
                ) : slots.length === 0 ? (
                  <p className="text-body-s text-neutral-600">
                    Nenhum horário livre neste dia.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <ChipRadio
                        key={slot}
                        name="timeChoice"
                        value={slot}
                        label={slot}
                        checked={slot === time}
                        onChange={() => setTime(slot)}
                      />
                    ))}
                  </div>
                )}
              </fieldset>
            </div>
          </section>

          <section hidden={step !== 3} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-heading-5 text-neutral-900">Confirmar</h2>
              <p className="text-body-s text-neutral-600">
                Confira os dados antes de agendar.
              </p>
            </div>
            {patient && service && day && time && (
              <ul className="border border-neutral-100 px-6 py-2">
                <SummaryRow
                  icon={RiCalendarLine}
                  title={longDate(day)}
                  description={`${time} – ${addMinutes(time, service.durationMinutes)} · ${service.name}`}
                />
                <SummaryRow
                  icon={RiUserLine}
                  title={patient.fullName}
                  description={patientDescription(patient)}
                />
                <SummaryRow
                  icon={RiMoneyDollarCircleLine}
                  title={formatCurrency(service.priceCents)}
                  description="Cobrado ao concluir o atendimento"
                />
              </ul>
            )}
            <TextareaField
              id="notes"
              name="notes"
              label="Observações (opcional)"
              placeholder="Ex.: trazer exames anteriores"
              maxLength={500}
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </section>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <FormMessage>{hint ?? state?.message}</FormMessage>
            <div className="flex justify-end gap-3">
              {step > 0 ? (
                <Button key="back" hierarchy="secondary" onClick={goBack}>
                  Voltar
                </Button>
              ) : (
                <Link
                  href="/painel/agenda"
                  className={buttonClasses({
                    hierarchy: 'secondary',
                    color: 'gray',
                  })}
                >
                  Cancelar
                </Link>
              )}
              {step === STEPS.length - 1 ? (
                <Button key="submit" type="submit" disabled={isPending}>
                  Agendar atendimento
                </Button>
              ) : (
                <Button key="continue" onClick={handleContinue}>
                  Continuar
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

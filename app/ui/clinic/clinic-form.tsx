'use client';

import { useActionState, useId, useRef, useState } from 'react';
import {
  type ClinicState,
  createClinic,
  updateClinic,
} from '@/app/lib/actions';
import {
  type Clinic,
  type ClinicField,
  WEEK_DAYS,
} from '@/app/lib/definitions';
import { formatCnpj, formatPhone, formatZipCode } from '@/app/lib/utils';
import AddressFields from '@/app/ui/address-fields';
import { Button } from '@/app/ui/button';
import Checkbox from '@/app/ui/checkbox';
import { TextareaField, TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import FormSection from '@/app/ui/form-section';
import ProgressBar from '@/app/ui/progress-bar';
import Stepper from '@/app/ui/stepper';
import { TabButtons } from '@/app/ui/tabs';

type Values = Partial<Record<ClinicField, string>>;
type Errors = Partial<Record<ClinicField, string[]>>;

const SECTIONS = [
  {
    tab: 'Dados',
    title: 'Dados da clínica',
    description: 'Identificação e contato exibidos para os pacientes.',
    step: 'Nome, CNPJ e contato',
    fields: ['name', 'cnpj', 'phone', 'contactEmail', 'description'],
  },
  {
    tab: 'Endereço',
    title: 'Endereço',
    description: 'Onde os atendimentos acontecem.',
    step: 'Onde você atende',
    fields: [
      'zipCode',
      'street',
      'streetNumber',
      'neighborhood',
      'addressComplement',
      'city',
      'state',
    ],
  },
  {
    tab: 'Expediente',
    title: 'Expediente',
    description: 'Horário e dias em que a agenda aceita atendimentos.',
    step: 'Horário e dias',
    fields: ['openingTime', 'closingTime', 'workingDays'],
  },
] satisfies {
  tab: string;
  title: string;
  description: string;
  step: string;
  fields: ClinicField[];
}[];

function toValues(clinic: Clinic): Values {
  return {
    name: clinic.name,
    cnpj: formatCnpj(clinic.cnpj),
    description: clinic.description ?? '',
    phone: clinic.phone ? formatPhone(clinic.phone) : '',
    contactEmail: clinic.contactEmail ?? '',
    zipCode: clinic.zipCode ? formatZipCode(clinic.zipCode) : '',
    street: clinic.street ?? '',
    streetNumber: clinic.streetNumber ?? '',
    neighborhood: clinic.neighborhood ?? '',
    addressComplement: clinic.addressComplement ?? '',
    city: clinic.city ?? '',
    state: clinic.state ?? '',
    openingTime: clinic.openingTime ?? '',
    closingTime: clinic.closingTime ?? '',
    workingDays: clinic.workingDays.join(','),
  };
}

function sectionHasErrors(index: number, errors?: Errors) {
  return SECTIONS[index].fields.some((field) => errors?.[field]);
}

function useSectionState(state: ClinicState) {
  const [current, setCurrent] = useState(0);
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    const withErrors = SECTIONS.findIndex((_, index) =>
      sectionHasErrors(index, state?.errors),
    );
    if (withErrors !== -1) {
      setCurrent(withErrors);
    }
  }
  return [current, setCurrent] as const;
}

function DetailsFields({
  values,
  errors,
}: {
  values: Values;
  errors?: Errors;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="name"
          name="name"
          label="Nome da clínica"
          maxLength={120}
          defaultValue={values.name}
          errors={errors?.name}
          required
        />
        <TextField
          id="cnpj"
          name="cnpj"
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          inputMode="numeric"
          defaultValue={values.cnpj}
          errors={errors?.cnpj}
          required
        />
        <TextField
          id="phone"
          name="phone"
          type="tel"
          label="Telefone"
          placeholder="(00) 00000-0000"
          autoComplete="tel"
          defaultValue={values.phone}
          errors={errors?.phone}
        />
        <TextField
          id="contactEmail"
          name="contactEmail"
          type="email"
          label="E-mail de contato"
          placeholder="contato@clinica.com"
          autoComplete="email"
          defaultValue={values.contactEmail}
          errors={errors?.contactEmail}
        />
      </div>
      <TextareaField
        id="description"
        name="description"
        label="Descrição"
        placeholder="Especialidades, público atendido, diferenciais…"
        helperText="Até 500 caracteres."
        maxLength={500}
        defaultValue={values.description}
        errors={errors?.description}
      />
    </>
  );
}

function HoursFields({ values, errors }: { values: Values; errors?: Errors }) {
  const workingDays = values.workingDays?.split(',') ?? [];
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="openingTime"
          name="openingTime"
          type="time"
          label="Abertura"
          defaultValue={values.openingTime}
          errors={errors?.openingTime}
        />
        <TextField
          id="closingTime"
          name="closingTime"
          type="time"
          label="Fechamento"
          defaultValue={values.closingTime}
          errors={errors?.closingTime}
        />
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-body-s mb-3 text-neutral-800">
          Dias de atendimento
        </legend>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {WEEK_DAYS.map((day, index) => (
            <Checkbox
              key={`${day}-${values.workingDays}`}
              name="workingDays"
              value={index}
              label={day}
              defaultChecked={workingDays.includes(String(index))}
            />
          ))}
        </div>
        {errors?.workingDays && (
          <p className="text-body-xs text-error-solid">
            Selecione dias válidos.
          </p>
        )}
      </fieldset>
    </>
  );
}

function SectionFields({
  index,
  values,
  errors,
}: {
  index: number;
  values: Values;
  errors?: Errors;
}) {
  if (index === 0) return <DetailsFields values={values} errors={errors} />;
  if (index === 1) return <AddressFields values={values} errors={errors} />;
  return <HoursFields values={values} errors={errors} />;
}

export function ClinicSetupForm() {
  const [state, formAction, isPending] = useActionState<ClinicState, FormData>(
    createClinic,
    undefined,
  );
  const [step, setStep] = useSectionState(state);
  const panelsRef = useRef<HTMLDivElement>(null);
  const values = state?.values ?? {};
  const errors = state?.errors;
  const section = SECTIONS[step];
  const progress = Math.round((step / SECTIONS.length) * 100);

  function handleContinue() {
    const fields = panelsRef.current?.querySelectorAll<HTMLInputElement>(
      `[data-step="${step}"] :is(input, textarea, select)`,
    );
    const invalid = Array.from(fields ?? []).find(
      (field) => !field.checkValidity(),
    );
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    setStep(step + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar
        label={`Cadastro ${progress}% concluído`}
        value={progress}
        helperText={`Etapa ${step + 1} de ${SECTIONS.length} · ${section.tab}`}
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="hidden border border-neutral-100 bg-white p-6 lg:block lg:w-80 lg:shrink-0">
          <Stepper
            label="Etapas do cadastro"
            current={step}
            steps={SECTIONS.map((item, index) => ({
              title: item.title,
              description: item.step,
              error: index >= step && sectionHasErrors(index, errors),
            }))}
          />
        </div>
        <form
          action={formAction}
          noValidate
          className="flex min-w-0 flex-1 flex-col gap-6 border border-neutral-100 bg-white p-6 sm:p-8"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-heading-5 text-neutral-900">{section.title}</h2>
            <p className="text-body-s text-neutral-600">
              {section.description}
            </p>
          </div>
          <div ref={panelsRef}>
            {SECTIONS.map((item, index) => (
              <div
                key={item.tab}
                data-step={index}
                hidden={index !== step}
                className="flex flex-col gap-5"
              >
                <SectionFields index={index} values={values} errors={errors} />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <FormMessage>{state?.message}</FormMessage>
            <div className="flex justify-end gap-3">
              {step > 0 && (
                <Button hierarchy="secondary" onClick={() => setStep(step - 1)}>
                  Voltar
                </Button>
              )}
              {step === SECTIONS.length - 1 ? (
                <Button key="submit" type="submit" disabled={isPending}>
                  Cadastrar clínica
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

export function ClinicSettingsForm({ clinic }: { clinic: Clinic }) {
  const [state, formAction, isPending] = useActionState<ClinicState, FormData>(
    updateClinic,
    undefined,
  );
  const [tab, setTab] = useSectionState(state);
  const idPrefix = useId();
  const values = state?.values ?? toValues(clinic);
  const errors = state?.errors;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <TabButtons
        label="Seções da clínica"
        idPrefix={idPrefix}
        current={tab}
        onChange={setTab}
        tabs={SECTIONS.map((section, index) => ({
          name: section.tab,
          error: sectionHasErrors(index, errors),
        }))}
      />
      {SECTIONS.map((section, index) => (
        <div
          key={section.tab}
          id={`${idPrefix}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${idPrefix}-tab-${index}`}
          hidden={index !== tab}
        >
          <FormSection title={section.title} description={section.description}>
            <SectionFields index={index} values={values} errors={errors} />
          </FormSection>
        </div>
      ))}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <FormMessage tone={state?.saved ? 'success' : 'error'}>
          {state?.message}
        </FormMessage>
        <div className="flex justify-end gap-3">
          <Button type="reset" hierarchy="secondary" color="gray">
            Descartar
          </Button>
          <Button type="submit" disabled={isPending}>
            Salvar alterações
          </Button>
        </div>
      </div>
    </form>
  );
}

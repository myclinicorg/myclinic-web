'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  createPatient,
  type PatientState,
  updatePatient,
} from '@/app/lib/actions';
import {
  type Patient,
  type PatientField,
  SEX_OPTIONS,
} from '@/app/lib/definitions';
import { formatCpf, formatPhone, formatZipCode } from '@/app/lib/utils';
import AddressFields from '@/app/ui/address-fields';
import { Button, buttonClasses } from '@/app/ui/button';
import { SelectField, TextareaField, TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import FormSection from '@/app/ui/form-section';

type Values = Partial<Record<PatientField, string>>;

function toValues(patient?: Patient): Values {
  if (!patient) {
    return {};
  }
  return {
    fullName: patient.fullName,
    cpf: formatCpf(patient.cpf),
    sex: patient.sex ?? '',
    dateOfBirth: patient.dateOfBirth?.slice(0, 10) ?? '',
    email: patient.email ?? '',
    phone: patient.phone ? formatPhone(patient.phone) : '',
    notes: patient.notes ?? '',
    zipCode: patient.zipCode ? formatZipCode(patient.zipCode) : '',
    street: patient.street ?? '',
    streetNumber: patient.streetNumber ?? '',
    neighborhood: patient.neighborhood ?? '',
    addressComplement: patient.addressComplement ?? '',
    city: patient.city ?? '',
    state: patient.state ?? '',
  };
}

export default function PatientForm({ patient }: { patient?: Patient }) {
  const [state, formAction, isPending] = useActionState<PatientState, FormData>(
    patient ? updatePatient.bind(null, patient.id) : createPatient,
    undefined,
  );
  const values = state?.values ?? toValues(patient);
  const errors = state?.errors;
  const sexOptions =
    values.sex && !SEX_OPTIONS.some((option) => option === values.sex)
      ? [...SEX_OPTIONS, values.sex]
      : SEX_OPTIONS;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormSection
        title="Dados pessoais"
        description="Identificação do paciente."
      >
        <TextField
          id="fullName"
          name="fullName"
          label="Nome completo"
          autoComplete="off"
          maxLength={120}
          defaultValue={values.fullName}
          errors={errors?.fullName}
          required
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id="cpf"
            name="cpf"
            label="CPF"
            placeholder="000.000.000-00"
            inputMode="numeric"
            autoComplete="off"
            defaultValue={values.cpf}
            errors={errors?.cpf}
            required
          />
          <TextField
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            label="Data de nascimento"
            defaultValue={values.dateOfBirth}
            errors={errors?.dateOfBirth}
          />
          <SelectField
            key={values.sex}
            id="sex"
            name="sex"
            label="Sexo"
            required={false}
            defaultValue={values.sex ?? ''}
            errors={errors?.sex}
          >
            <option value="">Não informado</option>
            {sexOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
        </div>
      </FormSection>

      <FormSection title="Contato" description="Como falar com o paciente.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="phone"
            name="phone"
            type="tel"
            label="Telefone"
            placeholder="(00) 00000-0000"
            autoComplete="off"
            defaultValue={values.phone}
            errors={errors?.phone}
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="E-mail"
            placeholder="paciente@exemplo.com"
            autoComplete="off"
            defaultValue={values.email}
            errors={errors?.email}
          />
        </div>
      </FormSection>

      <FormSection title="Endereço" description="Opcional.">
        <AddressFields values={values} errors={errors} />
      </FormSection>

      <FormSection
        title="Observações"
        description="Alergias, preferências e outras anotações."
      >
        <TextareaField
          id="notes"
          name="notes"
          label="Observações"
          helperText="Até 2000 caracteres."
          maxLength={2000}
          rows={5}
          defaultValue={values.notes}
          errors={errors?.notes}
        />
      </FormSection>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <FormMessage>{state?.message}</FormMessage>
        <div className="flex justify-end gap-3">
          <Link
            href={
              patient ? `/painel/pacientes/${patient.id}` : '/painel/pacientes'
            }
            className={buttonClasses({ hierarchy: 'secondary', color: 'gray' })}
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={isPending}>
            {patient ? 'Salvar alterações' : 'Cadastrar paciente'}
          </Button>
        </div>
      </div>
    </form>
  );
}

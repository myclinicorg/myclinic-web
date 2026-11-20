'use client';

import { useActionState } from 'react';
import {
  type ClinicState,
  createClinic,
  updateClinic,
} from '@/app/lib/actions';
import {
  type Clinic,
  type ClinicField,
  UFS,
  WEEK_DAYS,
} from '@/app/lib/definitions';
import { formatCnpj, formatPhone, formatZipCode } from '@/app/lib/utils';
import { Button } from '@/app/ui/button';
import Checkbox from '@/app/ui/checkbox';
import { SelectField, TextareaField, TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import FormSection from '@/app/ui/form-section';

type Values = Partial<Record<ClinicField, string>>;

function toValues(clinic?: Clinic): Values {
  if (!clinic) {
    return {};
  }
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

export default function ClinicForm({ clinic }: { clinic?: Clinic }) {
  const [state, formAction, isPending] = useActionState<ClinicState, FormData>(
    clinic ? updateClinic : createClinic,
    undefined,
  );
  const values = state?.values ?? toValues(clinic);
  const errors = state?.errors;
  const workingDays = values.workingDays?.split(',') ?? [];

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormSection
        title="Dados da clínica"
        description="Identificação e contato exibidos para os pacientes."
      >
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
      </FormSection>

      <FormSection
        title="Endereço"
        description="Onde os atendimentos acontecem."
      >
        <div className="grid gap-4 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <TextField
              id="zipCode"
              name="zipCode"
              label="CEP"
              placeholder="00000-000"
              inputMode="numeric"
              autoComplete="postal-code"
              defaultValue={values.zipCode}
              errors={errors?.zipCode}
            />
          </div>
          <div className="sm:col-span-4">
            <TextField
              id="street"
              name="street"
              label="Rua"
              autoComplete="address-line1"
              maxLength={120}
              defaultValue={values.street}
              errors={errors?.street}
            />
          </div>
          <div className="sm:col-span-2">
            <TextField
              id="streetNumber"
              name="streetNumber"
              label="Número"
              maxLength={20}
              defaultValue={values.streetNumber}
              errors={errors?.streetNumber}
            />
          </div>
          <div className="sm:col-span-4">
            <TextField
              id="addressComplement"
              name="addressComplement"
              label="Complemento"
              placeholder="Sala, andar, bloco…"
              autoComplete="address-line2"
              maxLength={80}
              defaultValue={values.addressComplement}
              errors={errors?.addressComplement}
            />
          </div>
          <div className="sm:col-span-2">
            <TextField
              id="neighborhood"
              name="neighborhood"
              label="Bairro"
              maxLength={80}
              defaultValue={values.neighborhood}
              errors={errors?.neighborhood}
            />
          </div>
          <div className="sm:col-span-3">
            <TextField
              id="city"
              name="city"
              label="Cidade"
              autoComplete="address-level2"
              maxLength={80}
              defaultValue={values.city}
              errors={errors?.city}
            />
          </div>
          <div className="sm:col-span-1">
            <SelectField
              id="state"
              name="state"
              label="UF"
              required={false}
              defaultValue={values.state ?? ''}
              errors={errors?.state}
            >
              <option value="">—</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </SelectField>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Expediente"
        description="Horário e dias em que a agenda aceita atendimentos."
      >
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
                key={day}
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
      </FormSection>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <FormMessage tone={state?.saved ? 'success' : 'error'}>
          {state?.message}
        </FormMessage>
        <div className="flex justify-end gap-3">
          {clinic && (
            <Button type="reset" hierarchy="secondary" color="gray">
              Descartar
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {clinic ? 'Salvar alterações' : 'Cadastrar clínica'}
          </Button>
        </div>
      </div>
    </form>
  );
}

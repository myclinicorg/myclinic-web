'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  createService,
  type ServiceState,
  updateService,
} from '@/app/lib/actions';
import type { Service, ServiceField } from '@/app/lib/definitions';
import { formatCentsForInput } from '@/app/lib/utils';
import { Button, buttonClasses } from '@/app/ui/button';
import { TextareaField, TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import FormSection from '@/app/ui/form-section';
import Switch from '@/app/ui/switch';

type Values = Partial<Record<ServiceField, string>>;

function toValues(service?: Service): Values {
  if (!service) {
    return { durationMinutes: '30', active: 'on' };
  }
  return {
    name: service.name,
    description: service.description ?? '',
    price: formatCentsForInput(service.priceCents),
    durationMinutes: String(service.durationMinutes),
    active: service.active ? 'on' : '',
  };
}

export default function ServiceForm({ service }: { service?: Service }) {
  const [state, formAction, isPending] = useActionState<ServiceState, FormData>(
    service ? updateService.bind(null, service.id) : createService,
    undefined,
  );
  const values = state?.values ?? toValues(service);
  const errors = state?.errors;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormSection
        title="Dados do serviço"
        description="Como o serviço aparece na agenda e no caixa."
      >
        <TextField
          id="name"
          name="name"
          label="Nome"
          placeholder="Ex.: Consulta inicial"
          maxLength={120}
          defaultValue={values.name}
          errors={errors?.name}
          required
        />
        <TextareaField
          id="description"
          name="description"
          label="Descrição"
          helperText="Até 500 caracteres."
          maxLength={500}
          defaultValue={values.description}
          errors={errors?.description}
        />
      </FormSection>

      <FormSection
        title="Preço e duração"
        description="Usados ao agendar e ao concluir o atendimento."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="price"
            name="price"
            label="Preço (R$)"
            placeholder="0,00"
            inputMode="decimal"
            iconLeft={<span className="text-body-s text-neutral-600">R$</span>}
            defaultValue={values.price}
            errors={errors?.price}
            required
          />
          <TextField
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            label="Duração (minutos)"
            min={5}
            max={720}
            step={5}
            defaultValue={values.durationMinutes}
            errors={errors?.durationMinutes}
            required
          />
        </div>
        <Switch
          key={values.active}
          id="active"
          name="active"
          label="Serviço ativo"
          helperText="Serviços inativos não aparecem ao criar agendamentos."
          defaultChecked={values.active === 'on'}
        />
      </FormSection>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <FormMessage>{state?.message}</FormMessage>
        <div className="flex justify-end gap-3">
          <Link
            href="/painel/servicos"
            className={buttonClasses({ hierarchy: 'secondary', color: 'gray' })}
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={isPending}>
            {service ? 'Salvar alterações' : 'Cadastrar serviço'}
          </Button>
        </div>
      </div>
    </form>
  );
}

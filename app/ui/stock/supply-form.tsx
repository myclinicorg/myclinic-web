'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  createSupply,
  type SupplyState,
  updateSupply,
} from '@/app/lib/actions';
import type { Supply, SupplyField } from '@/app/lib/definitions';
import { formatCentsForInput, formatQuantity } from '@/app/lib/utils';
import { Button, buttonClasses } from '@/app/ui/button';
import { TextareaField, TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import FormSection from '@/app/ui/form-section';
import Switch from '@/app/ui/switch';

type Values = Partial<Record<SupplyField, string>>;

function toValues(supply?: Supply): Values {
  if (!supply) {
    return { unit: 'un', minQuantity: '0', active: 'on' };
  }
  return {
    name: supply.name,
    description: supply.description ?? '',
    unit: supply.unit,
    minQuantity: formatQuantity(supply.minQuantity),
    unitCost:
      supply.unitCostCents !== null
        ? formatCentsForInput(supply.unitCostCents)
        : '',
    active: supply.active ? 'on' : '',
  };
}

export default function SupplyForm({ supply }: { supply?: Supply }) {
  const [state, formAction, isPending] = useActionState<SupplyState, FormData>(
    supply ? updateSupply.bind(null, supply.id) : createSupply,
    undefined,
  );
  const values = state?.values ?? toValues(supply);
  const errors = state?.errors;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormSection
        title="Dados do insumo"
        description="Nome e unidade usados nas movimentações."
      >
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
          <TextField
            id="name"
            name="name"
            label="Nome"
            placeholder="Ex.: Luvas descartáveis"
            maxLength={120}
            defaultValue={values.name}
            errors={errors?.name}
            required
          />
          <TextField
            id="unit"
            name="unit"
            label="Unidade"
            placeholder="un, cx, ml…"
            maxLength={20}
            defaultValue={values.unit}
            errors={errors?.unit}
            required
          />
        </div>
        <TextareaField
          id="description"
          name="description"
          label="Descrição (opcional)"
          maxLength={500}
          rows={3}
          defaultValue={values.description}
          errors={errors?.description}
        />
      </FormSection>

      <FormSection
        title="Controle"
        description="O alerta de estoque baixo usa o mínimo; o custo entra no valor do estoque."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="minQuantity"
            name="minQuantity"
            label="Estoque mínimo"
            inputMode="decimal"
            defaultValue={values.minQuantity}
            errors={errors?.minQuantity}
          />
          <TextField
            id="unitCost"
            name="unitCost"
            label="Custo unitário (opcional)"
            placeholder="0,00"
            inputMode="decimal"
            iconLeft={<span className="text-body-s text-neutral-600">R$</span>}
            defaultValue={values.unitCost}
            errors={errors?.unitCost}
          />
        </div>
        <Switch
          key={values.active}
          id="active"
          name="active"
          label="Insumo ativo"
          helperText="Inativos não aparecem nos alertas de estoque baixo."
          defaultChecked={values.active === 'on'}
        />
      </FormSection>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <FormMessage>{state?.message}</FormMessage>
        <div className="flex justify-end gap-3">
          <Link
            href={supply ? `/painel/estoque/${supply.id}` : '/painel/estoque'}
            className={buttonClasses({ hierarchy: 'secondary', color: 'gray' })}
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={isPending}>
            {supply ? 'Salvar alterações' : 'Cadastrar insumo'}
          </Button>
        </div>
      </div>
    </form>
  );
}

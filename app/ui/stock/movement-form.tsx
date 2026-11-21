'use client';

import { startTransition, useActionState, useState } from 'react';
import { addMovement, type MovementState } from '@/app/lib/actions';
import {
  PAYMENT_METHODS,
  STOCK_MOVEMENT_TYPES,
  type StockMovementType,
  type Supply,
} from '@/app/lib/definitions';
import { formatCentsForInput } from '@/app/lib/utils';
import { Button } from '@/app/ui/button';
import { SelectField, TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import NumberStepper from '@/app/ui/number-stepper';
import OptionCard from '@/app/ui/option-card';
import Switch from '@/app/ui/switch';

export default function MovementForm({ supply }: { supply: Supply }) {
  const [state, formAction, isPending] = useActionState<
    MovementState,
    FormData
  >(addMovement.bind(null, supply.id), undefined);
  const values = state?.values;
  const errors = state?.errors;
  const [type, setType] = useState<StockMovementType>(
    (values?.type as StockMovementType) ?? 'IN',
  );
  const [expense, setExpense] = useState(values?.registerExpense === 'on');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 border border-neutral-100 bg-white p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-subtitle-m text-neutral-900">
          Registrar movimentação
        </h2>
        <p className="text-body-xs text-neutral-600">
          Saldo atual: {supply.currentQuantity.replace('.', ',')} {supply.unit}
        </p>
      </div>
      <div role="radiogroup" aria-label="Tipo" className="flex flex-col gap-2">
        {Object.entries(STOCK_MOVEMENT_TYPES).map(([value, item]) => (
          <OptionCard
            key={value}
            name="type"
            value={value}
            title={item.label}
            description={item.description}
            checked={type === value}
            onChange={() => setType(value as StockMovementType)}
          />
        ))}
      </div>
      <NumberStepper
        key={`${type}-${values?.quantity}`}
        id="quantity"
        name="quantity"
        label={`Quantidade (${supply.unit})`}
        defaultValue={values?.quantity ?? '1'}
        min={type === 'ADJUSTMENT' ? undefined : 0}
        errors={errors?.quantity}
      />
      {type === 'IN' && (
        <>
          <TextField
            id="unitCost"
            name="unitCost"
            label="Custo unitário (opcional)"
            placeholder="0,00"
            inputMode="decimal"
            iconLeft={<span className="text-body-s text-neutral-600">R$</span>}
            defaultValue={
              values?.unitCost ??
              (supply.unitCostCents !== null
                ? formatCentsForInput(supply.unitCostCents)
                : '')
            }
            errors={errors?.unitCost}
          />
          <Switch
            id="registerExpense"
            name="registerExpense"
            label="Lançar despesa no caixa"
            helperText="Cria uma despesa de insumos com quantidade × custo."
            checked={expense}
            onChange={(event) => setExpense(event.target.checked)}
          />
          {expense && (
            <SelectField
              id="paymentMethod"
              name="paymentMethod"
              label="Pagamento"
              defaultValue={values?.paymentMethod ?? ''}
            >
              <option value="">Pagar depois (fica pendente)</option>
              {Object.entries(PAYMENT_METHODS).map(([value, method]) => (
                <option key={value} value={value}>
                  Pago com {method.label.toLowerCase()}
                </option>
              ))}
            </SelectField>
          )}
        </>
      )}
      <TextField
        id="reason"
        name="reason"
        label="Motivo (opcional)"
        placeholder={
          type === 'OUT'
            ? 'Ex.: usado no atendimento'
            : 'Ex.: compra no fornecedor'
        }
        maxLength={500}
        defaultValue={values?.reason}
        errors={errors?.reason}
      />
      <FormMessage>{state?.message}</FormMessage>
      <Button type="submit" disabled={isPending}>
        Registrar
      </Button>
    </form>
  );
}

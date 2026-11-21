'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  createTransaction,
  type TransactionState,
  updateTransaction,
} from '@/app/lib/actions';
import {
  PAYMENT_METHODS,
  type Transaction,
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
  type TransactionField,
  type TransactionType,
} from '@/app/lib/definitions';
import { formatCentsForInput } from '@/app/lib/utils';
import { Button, buttonClasses } from '@/app/ui/button';
import { SelectField, TextField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import FormSection from '@/app/ui/form-section';
import OptionCard from '@/app/ui/option-card';
import Switch from '@/app/ui/switch';

type Values = Partial<Record<TransactionField, string>>;

function toValues(today: string, transaction?: Transaction): Values {
  if (!transaction) {
    return { type: 'INCOME', dueDate: today, paid: 'on', paymentMethod: 'PIX' };
  }
  return {
    type: transaction.type,
    category: transaction.category,
    description: transaction.description ?? '',
    amount: formatCentsForInput(transaction.amountCents),
    dueDate: transaction.dueDate.slice(0, 10),
  };
}

export default function TransactionForm({
  today,
  transaction,
}: {
  today: string;
  transaction?: Transaction;
}) {
  const [state, formAction, isPending] = useActionState<
    TransactionState,
    FormData
  >(
    transaction
      ? updateTransaction.bind(null, transaction.id)
      : createTransaction,
    undefined,
  );
  const values = state?.values ?? toValues(today, transaction);
  const errors = state?.errors;
  const [type, setType] = useState<TransactionType>(
    (values.type as TransactionType) ?? 'INCOME',
  );
  const [paid, setPaid] = useState(values.paid === 'on');

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormSection
        title="Tipo e categoria"
        description="Receitas entram no caixa; despesas saem."
      >
        {transaction ? (
          <p className="text-body-m text-neutral-800">
            {TRANSACTION_TYPES[transaction.type].label}
          </p>
        ) : (
          <div
            role="radiogroup"
            aria-label="Tipo"
            className="grid gap-3 sm:grid-cols-2"
          >
            <OptionCard
              name="type"
              value="INCOME"
              title="Receita"
              description="Atendimento, venda, outros"
              checked={type === 'INCOME'}
              onChange={() => setType('INCOME')}
            />
            <OptionCard
              name="type"
              value="EXPENSE"
              title="Despesa"
              description="Aluguel, insumos, contas"
              checked={type === 'EXPENSE'}
              onChange={() => setType('EXPENSE')}
            />
          </div>
        )}
        <SelectField
          key={`${type}-${values.category}`}
          id="category"
          name="category"
          label="Categoria"
          placeholder="Escolha a categoria"
          defaultValue={
            values.category && values.category in TRANSACTION_CATEGORIES[type]
              ? values.category
              : ''
          }
          errors={errors?.category}
        >
          {Object.entries(TRANSACTION_CATEGORIES[type]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ),
          )}
        </SelectField>
        <TextField
          id="description"
          name="description"
          label="Descrição (opcional)"
          placeholder={
            type === 'INCOME' ? 'Ex.: venda de kit' : 'Ex.: aluguel de novembro'
          }
          maxLength={500}
          defaultValue={values.description}
          errors={errors?.description}
        />
      </FormSection>

      <FormSection
        title="Valor e vencimento"
        description="O caixa do mês considera a data de vencimento."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="amount"
            name="amount"
            label="Valor (R$)"
            placeholder="0,00"
            inputMode="decimal"
            iconLeft={<span className="text-body-s text-neutral-600">R$</span>}
            defaultValue={values.amount}
            errors={errors?.amount}
            required
          />
          <TextField
            id="dueDate"
            name="dueDate"
            type="date"
            label="Vencimento"
            defaultValue={values.dueDate}
            errors={errors?.dueDate}
            required
          />
        </div>
        {!transaction && (
          <>
            <Switch
              id="paid"
              name="paid"
              label="Já foi pago"
              helperText="Desligue para deixar como pendente."
              checked={paid}
              onChange={(event) => setPaid(event.target.checked)}
            />
            {paid && (
              <SelectField
                key={values.paymentMethod}
                id="paymentMethod"
                name="paymentMethod"
                label="Forma de pagamento"
                defaultValue={values.paymentMethod || 'PIX'}
                errors={errors?.paymentMethod}
              >
                {Object.entries(PAYMENT_METHODS).map(([value, method]) => (
                  <option key={value} value={value}>
                    {method.label}
                  </option>
                ))}
              </SelectField>
            )}
          </>
        )}
      </FormSection>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <FormMessage>{state?.message}</FormMessage>
        <div className="flex justify-end gap-3">
          <Link
            href="/painel/caixa"
            className={buttonClasses({ hierarchy: 'secondary', color: 'gray' })}
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={isPending}>
            {transaction ? 'Salvar alterações' : 'Registrar lançamento'}
          </Button>
        </div>
      </div>
    </form>
  );
}

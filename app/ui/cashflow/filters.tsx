'use client';

import { RiFilter3Line } from '@remixicon/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_STATUS,
  type TransactionCategory,
  type TransactionStatus,
} from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import { cashflowHref, type CashflowParams } from '@/app/ui/cashflow/links';
import Drawer from '@/app/ui/drawer';
import { SelectField } from '@/app/ui/form-fields';

const radioClasses =
  'peer checked:border-brand-700 size-5 cursor-pointer appearance-none rounded-full border-[1.5px] border-neutral-700 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700';

export default function CashflowFilters({
  params,
}: {
  params: CashflowParams;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(params.status ?? '');
  const [category, setCategory] = useState(params.category ?? '');
  const active = [params.status, params.category].filter(Boolean).length;
  const categoryGroups =
    params.tab === 'receitas'
      ? (['INCOME'] as const)
      : params.tab === 'despesas'
        ? (['EXPENSE'] as const)
        : (['INCOME', 'EXPENSE'] as const);

  function apply(next: { status?: string; category?: string }) {
    setOpen(false);
    router.push(
      cashflowHref({
        ...params,
        status: (next.status || undefined) as TransactionStatus | undefined,
        category: (next.category || undefined) as
          TransactionCategory | undefined,
      }),
    );
  }

  return (
    <>
      <Button
        hierarchy="secondary"
        color="gray"
        size="s"
        onClick={() => {
          setStatus(params.status ?? '');
          setCategory(params.category ?? '');
          setOpen(true);
        }}
      >
        <RiFilter3Line aria-hidden />
        Filtros
        {active > 0 && (
          <span className="bg-brand-700 text-body-xs flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-normal tracking-normal text-white">
            {active}
          </span>
        )}
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filtrar lançamentos"
        footer={
          <>
            <Button hierarchy="secondary" onClick={() => apply({})}>
              Limpar
            </Button>
            <Button onClick={() => apply({ status, category })}>Aplicar</Button>
          </>
        }
      >
        <fieldset className="flex flex-col gap-3">
          <legend className="text-subtitle-m mb-3 text-neutral-900">
            Status
          </legend>
          {[
            ['', 'Todos'],
            ...Object.entries(TRANSACTION_STATUS).map(([value, item]) => [
              value,
              item.label,
            ]),
          ].map(([value, label]) => (
            <label
              key={value}
              className="text-body-m flex cursor-pointer items-center gap-3 text-neutral-800"
            >
              <span className="relative flex">
                <input
                  type="radio"
                  name="status"
                  value={value}
                  checked={status === value}
                  onChange={() => setStatus(value)}
                  className={radioClasses}
                />
                <span
                  aria-hidden
                  className="bg-brand-700 pointer-events-none absolute inset-0 m-auto hidden size-2.5 rounded-full peer-checked:block"
                />
              </span>
              {label}
            </label>
          ))}
        </fieldset>
        <SelectField
          id="filter-category"
          label="Categoria"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categoryGroups.map((type) => (
            <optgroup
              key={type}
              label={type === 'INCOME' ? 'Receitas' : 'Despesas'}
            >
              {Object.entries(TRANSACTION_CATEGORIES[type]).map(
                ([value, label]) => (
                  <option key={`${type}-${value}`} value={value}>
                    {label}
                  </option>
                ),
              )}
            </optgroup>
          ))}
        </SelectField>
      </Drawer>
    </>
  );
}

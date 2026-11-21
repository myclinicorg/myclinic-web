'use client';

import { RiAddLine, RiSubtractLine } from '@remixicon/react';
import clsx from 'clsx';
import { useState } from 'react';
import { formatQuantity, parseDecimal } from '@/app/lib/utils';

const buttonClasses =
  'focus-visible:outline-brand-700 flex size-10 shrink-0 items-center justify-center text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2 disabled:text-neutral-400 disabled:hover:bg-transparent';

export default function NumberStepper({
  id,
  name,
  label,
  defaultValue = '1',
  min,
  step = 1,
  errors,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  min?: number;
  step?: number;
  errors?: string[];
}) {
  const [value, setValue] = useState(defaultValue);
  const number = parseDecimal(value);
  const hasError = Boolean(errors?.length);

  function change(delta: number) {
    const base = Number.isFinite(number) ? number : 0;
    const next = Math.round((base + delta) * 1000) / 1000;
    setValue(formatQuantity(min !== undefined ? Math.max(min, next) : next));
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body-s text-neutral-800">
        {label}
      </label>
      <div
        className={clsx(
          'flex w-fit items-center border bg-white',
          hasError ? 'border-error-solid' : 'border-neutral-200',
        )}
      >
        <button
          type="button"
          onClick={() => change(-step)}
          disabled={
            min !== undefined && Number.isFinite(number) && number - step < min
          }
          aria-label="Diminuir"
          className={buttonClasses}
        >
          <RiSubtractLine aria-hidden className="size-5" />
        </button>
        <input
          id={id}
          name={name}
          inputMode="decimal"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className="text-body-m focus-visible:outline-brand-700 h-10 w-20 border-x border-neutral-200 text-center text-neutral-900 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2"
        />
        <button
          type="button"
          onClick={() => change(step)}
          aria-label="Aumentar"
          className={buttonClasses}
        >
          <RiAddLine aria-hidden className="size-5" />
        </button>
      </div>
      {hasError && (
        <p id={`${id}-error`} className="text-body-xs text-error-solid">
          {errors![0]}
        </p>
      )}
    </div>
  );
}

import { RiCheckboxCircleLine } from '@remixicon/react';
import clsx from 'clsx';
import type { components } from '@/app/lib/api-schema';

type Supply = components['schemas']['SupplyEntity'];

const quantity = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

export default function LowStockList({ supplies }: { supplies: Supply[] }) {
  if (supplies.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <span className="bg-success-soft flex size-12 items-center justify-center rounded-full">
          <RiCheckboxCircleLine
            aria-hidden
            className="text-success-text size-6"
          />
        </span>
        <p className="text-subtitle-m text-neutral-900">Estoque em dia</p>
        <p className="text-body-s text-neutral-600">
          Nenhum insumo abaixo do mínimo.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {supplies.map((supply) => {
        const current = Number(supply.currentQuantity);
        const minimum = Number(supply.minQuantity);
        const level = minimum > 0 ? Math.min(current / minimum, 1) : 0;
        const critical = level < 0.5;
        return (
          <li key={supply.id} className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-subtitle-s min-w-0 flex-1 truncate text-neutral-900">
                {supply.name}
              </span>
              <span className="text-body-xs text-neutral-600 tabular-nums">
                {quantity.format(current)} de {quantity.format(minimum)}{' '}
                {supply.unit}
              </span>
            </div>
            <div
              role="meter"
              aria-label={`${supply.name}: ${quantity.format(current)} de ${quantity.format(minimum)} ${supply.unit}`}
              aria-valuenow={current}
              aria-valuemin={0}
              aria-valuemax={minimum}
              className={clsx(
                'h-2 overflow-clip rounded-full',
                critical ? 'bg-error-soft' : 'bg-warning-soft',
              )}
            >
              <div
                className={clsx(
                  'h-full rounded-full',
                  critical ? 'bg-error-solid' : 'bg-warning-solid',
                )}
                style={{ width: `${level * 100}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

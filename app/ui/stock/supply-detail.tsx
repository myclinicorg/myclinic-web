import { RiEditLine } from '@remixicon/react';
import Link from 'next/link';
import {
  STOCK_MOVEMENT_TYPES,
  type StockMovement,
  type Supply,
  TRANSACTION_STATUS,
} from '@/app/lib/definitions';
import {
  formatCurrency,
  formatDateTime,
  formatQuantity,
} from '@/app/lib/utils';
import { Badge } from '@/app/ui/badge';
import { buttonClasses } from '@/app/ui/button';
import { DeleteSupply } from '@/app/ui/stock/buttons';
import StockMeter, { stockLevel } from '@/app/ui/stock/stock-meter';
import Timeline from '@/app/ui/timeline';

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <dt className="text-body-s w-36 shrink-0 text-neutral-600">{label}</dt>
      <dd className="text-body-s text-neutral-900 tabular-nums">{children}</dd>
    </div>
  );
}

export function SupplyHeader({ supply }: { supply: Supply }) {
  const level = stockLevel(
    Number(supply.currentQuantity),
    Number(supply.minQuantity),
  );
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-heading-4 text-neutral-900">{supply.name}</h1>
          {!supply.active ? (
            <Badge color="gray" dot>
              Inativo
            </Badge>
          ) : level !== 'ok' ? (
            <Badge color={level === 'critical' ? 'danger' : 'warning'} dot>
              Estoque baixo
            </Badge>
          ) : (
            <Badge color="success" dot>
              Em dia
            </Badge>
          )}
        </div>
        {supply.description && (
          <p className="text-body-m text-neutral-600">{supply.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <DeleteSupply id={supply.id} name={supply.name} />
        <Link
          href={`/painel/estoque/${supply.id}/editar`}
          className={buttonClasses({ hierarchy: 'secondary', color: 'gray' })}
        >
          <RiEditLine aria-hidden />
          Editar
        </Link>
      </div>
    </div>
  );
}

export function SupplyLevel({ supply }: { supply: Supply }) {
  const current = Number(supply.currentQuantity);
  const minimum = Number(supply.minQuantity);
  return (
    <section className="flex flex-col gap-4 border border-neutral-100 bg-white p-6">
      <h2 className="text-subtitle-m text-neutral-900">Nível</h2>
      <p className="text-heading-3 text-neutral-900">
        {formatQuantity(current)}{' '}
        <span className="text-body-m text-neutral-600">{supply.unit}</span>
      </p>
      <StockMeter
        name={supply.name}
        current={current}
        minimum={minimum}
        unit={supply.unit}
        showText={false}
      />
      <dl className="flex flex-col gap-2">
        <Row label="Estoque mínimo">
          {formatQuantity(minimum)} {supply.unit}
        </Row>
        <Row label="Custo unitário">
          {supply.unitCostCents !== null
            ? formatCurrency(supply.unitCostCents)
            : '—'}
        </Row>
        <Row label="Valor em estoque">
          {supply.unitCostCents !== null
            ? formatCurrency(Math.round(current * supply.unitCostCents))
            : '—'}
        </Row>
      </dl>
    </section>
  );
}

function movementTitle(movement: StockMovement, unit: string) {
  const quantity = Number(movement.quantity);
  const label = STOCK_MOVEMENT_TYPES[movement.type].label;
  const amount =
    movement.type === 'ADJUSTMENT'
      ? `${quantity > 0 ? '+' : '−'}${formatQuantity(Math.abs(quantity))}`
      : formatQuantity(Math.abs(quantity));
  return `${label} de ${amount} ${unit}`;
}

export function SupplyMovements({
  movements,
  total,
  unit,
}: {
  movements: StockMovement[];
  total: number;
  unit: string;
}) {
  return (
    <section className="flex flex-col gap-4 border border-neutral-100 bg-white p-6">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-subtitle-m text-neutral-900">Movimentações</h2>
        <p className="text-body-xs text-neutral-600">
          {total === 0
            ? 'Nenhuma movimentação ainda.'
            : total > movements.length
              ? `As ${movements.length} mais recentes de ${total}`
              : `${total} movimentaç${total === 1 ? 'ão' : 'ões'}`}
        </p>
      </div>
      {movements.length > 0 && (
        <Timeline
          items={movements.map((movement) => ({
            id: movement.id,
            date: formatDateTime(movement.occurredAt),
            title: movementTitle(movement, unit),
            description:
              [
                movement.reason,
                movement.unitCostCents !== null && movement.type === 'IN'
                  ? `${formatCurrency(movement.unitCostCents)} por ${unit}`
                  : null,
              ]
                .filter(Boolean)
                .join(' · ') || undefined,
            badge: movement.transaction ? (
              <Badge
                color={TRANSACTION_STATUS[movement.transaction.status].color}
                size="s"
              >
                Despesa {formatCurrency(movement.transaction.amountCents)} ·{' '}
                {TRANSACTION_STATUS[movement.transaction.status].label}
              </Badge>
            ) : undefined,
          }))}
        />
      )}
    </section>
  );
}

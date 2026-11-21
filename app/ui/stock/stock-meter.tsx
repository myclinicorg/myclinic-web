import clsx from 'clsx';
import { formatQuantity } from '@/app/lib/utils';

export function stockLevel(current: number, minimum: number) {
  if (minimum <= 0) return 'ok';
  if (current <= minimum / 2) return 'critical';
  if (current <= minimum) return 'low';
  return 'ok';
}

const COLORS = {
  critical: { track: 'bg-error-soft', fill: 'bg-error-solid' },
  low: { track: 'bg-warning-soft', fill: 'bg-warning-solid' },
  ok: { track: 'bg-brand-50', fill: 'bg-brand-700' },
};

export default function StockMeter({
  name,
  current,
  minimum,
  unit,
  showText = true,
}: {
  name: string;
  current: number;
  minimum: number;
  unit: string;
  showText?: boolean;
}) {
  const level = stockLevel(current, minimum);
  const scale = minimum > 0 ? minimum * 2 : Math.max(current, 1);
  const label = `${formatQuantity(current)} ${unit} · mínimo ${formatQuantity(minimum)}`;

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {showText && (
        <span className="text-body-xs text-neutral-600 tabular-nums">
          {label}
        </span>
      )}
      <div
        role="meter"
        aria-label={`${name}: ${label}`}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={scale}
        className={clsx('h-2 overflow-clip rounded-full', COLORS[level].track)}
      >
        <div
          className={clsx('h-full rounded-full', COLORS[level].fill)}
          style={{ width: `${Math.min(current / scale, 1) * 100}%` }}
        />
      </div>
    </div>
  );
}

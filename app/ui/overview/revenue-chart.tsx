import clsx from 'clsx';
import { formatCurrency } from '@/app/lib/utils';

type Month = {
  month: string;
  year: string;
  incomeCents: number;
  expenseCents: number;
};

const SERIES = [
  { key: 'incomeCents', label: 'Receitas', color: 'bg-[#0f62fe]' },
  { key: 'expenseCents', label: 'Despesas', color: 'bg-[#eb6834]' },
] as const;

const compact = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function niceMax(value: number) {
  if (value <= 0) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((n) => n * magnitude * 4 >= value)!;
  return step * magnitude * 4;
}

export default function RevenueChart({ months }: { months: Month[] }) {
  const max = niceMax(
    Math.max(...months.flatMap((m) => [m.incomeCents, m.expenseCents])) / 100,
  );
  const ticks = [4, 3, 2, 1, 0].map((i) => (max / 4) * i);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="text-body-xxs flex h-48 flex-col justify-between text-right text-neutral-600 tabular-nums">
          {ticks.map((tick) => (
            <span key={tick} className="-my-1.5">
              R$ {compact.format(tick)}
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative h-48">
            {ticks.map((tick, i) => (
              <div
                key={tick}
                aria-hidden
                className="absolute inset-x-0 h-px bg-neutral-100"
                style={{ top: `${(i / 4) * 100}%` }}
              />
            ))}
            <ul className="absolute inset-0 flex">
              {months.map((month, index) => (
                <li
                  key={`${month.year}-${month.month}`}
                  tabIndex={0}
                  aria-label={`${month.month} de ${month.year}: receitas ${formatCurrency(month.incomeCents)}, despesas ${formatCurrency(month.expenseCents)}`}
                  className="group focus-visible:outline-brand-700 relative flex flex-1 items-end justify-center gap-0.5 outline-offset-2 hover:bg-neutral-50/60 focus-visible:outline-2"
                >
                  {SERIES.map((series) => (
                    <span
                      key={series.key}
                      className={`${series.color} w-full max-w-6 rounded-t group-hover:brightness-110`}
                      style={{
                        height: `${(month[series.key] / 100 / max) * 100}%`,
                      }}
                    />
                  ))}
                  <span
                    role="tooltip"
                    className={clsx(
                      'shadow-card pointer-events-none absolute top-2 z-10 hidden w-max flex-col gap-1 border border-neutral-100 bg-white px-3 py-2 text-left group-hover:flex group-focus-visible:flex',
                      index < months.length / 2
                        ? 'left-full ml-1'
                        : 'right-full mr-1',
                    )}
                  >
                    <span className="text-body-xs text-neutral-600">
                      {month.month} {month.year}
                    </span>
                    {SERIES.map((series) => (
                      <span
                        key={series.key}
                        className="flex items-center gap-2"
                      >
                        <span
                          aria-hidden
                          className={`${series.color} h-0.5 w-3`}
                        />
                        <span className="text-subtitle-s text-neutral-900 tabular-nums">
                          {formatCurrency(month[series.key])}
                        </span>
                        <span className="text-body-xs text-neutral-600">
                          {series.label}
                        </span>
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-body-xxs flex border-t border-neutral-200 pt-1.5 text-neutral-600">
            {months.map((month) => (
              <span
                key={`${month.year}-${month.month}`}
                className="flex-1 text-center"
              >
                {month.month}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {SERIES.map((series) => (
          <span
            key={series.key}
            className="text-body-s flex items-center gap-2 text-neutral-800"
          >
            <span
              aria-hidden
              className={`${series.color} size-2.5 rounded-sm`}
            />
            {series.label}
          </span>
        ))}
        <details className="text-body-s ml-auto">
          <summary className="text-brand-700 cursor-pointer hover:underline">
            Ver tabela
          </summary>
          <table className="text-body-s mt-3 w-full tabular-nums">
            <thead>
              <tr className="text-neutral-600">
                <th scope="col" className="pr-4 text-left font-normal">
                  Mês
                </th>
                <th scope="col" className="pr-4 text-right font-normal">
                  Receitas
                </th>
                <th scope="col" className="text-right font-normal">
                  Despesas
                </th>
              </tr>
            </thead>
            <tbody>
              {months.map((month) => (
                <tr key={`${month.year}-${month.month}`}>
                  <th scope="row" className="pr-4 text-left font-normal">
                    {month.month}/{month.year}
                  </th>
                  <td className="pr-4 text-right">
                    {formatCurrency(month.incomeCents)}
                  </td>
                  <td className="text-right">
                    {formatCurrency(month.expenseCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </div>
  );
}

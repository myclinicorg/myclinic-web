import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import Link from 'next/link';
import { addMonths, periodTitle } from '@/app/lib/schedule';
import { buttonClasses } from '@/app/ui/button';
import { cashflowHref, type CashflowParams } from '@/app/ui/cashflow/links';

const arrow = buttonClasses({
  hierarchy: 'tertiary',
  color: 'gray',
  size: 's',
  iconOnly: true,
});

export default function MonthNav({ params }: { params: CashflowParams }) {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={cashflowHref({ ...params, month: addMonths(params.month, -1) })}
        aria-label="Mês anterior"
        className={arrow}
      >
        <RiArrowLeftSLine aria-hidden className="size-5" />
      </Link>
      <h2 className="text-heading-5 min-w-44 text-center text-neutral-900">
        {periodTitle('mes', params.month)}
      </h2>
      <Link
        href={cashflowHref({ ...params, month: addMonths(params.month, 1) })}
        aria-label="Próximo mês"
        className={arrow}
      >
        <RiArrowRightSLine aria-hidden className="size-5" />
      </Link>
    </div>
  );
}

import { RiExchangeDollarLine } from '@remixicon/react';
import clsx from 'clsx';
import Link from 'next/link';
import {
  type CashflowFilters,
  fetchFilteredTransactions,
} from '@/app/lib/data';
import {
  categoryLabel,
  PAYMENT_METHODS,
  type Transaction,
  TRANSACTION_STATUS,
} from '@/app/lib/definitions';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import { Badge } from '@/app/ui/badge';
import TransactionActions from '@/app/ui/cashflow/transaction-actions';
import EmptyState from '@/app/ui/empty-state';
import Pagination from '@/app/ui/pagination';
import { buttonClasses } from '@/app/ui/button';

const headerCell =
  'h-11 border-b border-neutral-100 bg-neutral-50 px-4 text-left text-subtitle-s text-neutral-800';
const cell =
  'h-16 border-b border-neutral-100 px-4 text-body-s text-neutral-800';

function title(transaction: Transaction) {
  return (
    transaction.description ||
    categoryLabel(transaction.type, transaction.category)
  );
}

function signedAmount(transaction: Transaction) {
  return `${transaction.type === 'INCOME' ? '+' : '−'} ${formatCurrency(transaction.amountCents)}`;
}

function subtitle(transaction: Transaction) {
  return [
    categoryLabel(transaction.type, transaction.category),
    transaction.paymentMethod &&
      PAYMENT_METHODS[transaction.paymentMethod].label,
  ]
    .filter(Boolean)
    .join(' · ');
}

export async function TransactionsCount({
  filters,
}: {
  filters: CashflowFilters;
}) {
  const { meta } = await fetchFilteredTransactions(filters);
  return `${meta.total} lançamento${meta.total === 1 ? '' : 's'}`;
}

export default async function TransactionsTable({
  filters,
}: {
  filters: CashflowFilters;
}) {
  const { data: transactions, meta } = await fetchFilteredTransactions(filters);

  if (meta.total === 0) {
    return (
      <EmptyState
        icon={RiExchangeDollarLine}
        title="Nenhum lançamento"
        description="Não há lançamentos com vencimento neste mês para os filtros escolhidos."
      >
        <Link href="/painel/caixa/novo" className={buttonClasses()}>
          Novo lançamento
        </Link>
      </EmptyState>
    );
  }

  const first = (meta.page - 1) * meta.pageSize + 1;
  const last = first + transactions.length - 1;

  return (
    <>
      <ul className="md:hidden">
        {transactions.map((transaction) => {
          const status = TRANSACTION_STATUS[transaction.status];
          return (
            <li
              key={transaction.id}
              className="flex items-center gap-3 border-b border-neutral-100 py-3 pr-2 pl-4 last:border-b-0"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                  className={clsx(
                    'text-subtitle-m truncate text-neutral-900',
                    transaction.status === 'CANCELED' && 'line-through',
                  )}
                >
                  {title(transaction)}
                </span>
                <span className="text-body-s truncate text-neutral-600">
                  {formatDate(transaction.dueDate)} · {status.label}
                </span>
              </div>
              <span className="text-subtitle-s shrink-0 text-neutral-900 tabular-nums">
                {signedAmount(transaction)}
              </span>
              <TransactionActions
                id={transaction.id}
                name={title(transaction)}
                amount={formatCurrency(transaction.amountCents)}
                status={transaction.status}
                variant="sheet"
              />
            </li>
          );
        })}
      </ul>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className={`${headerCell} w-32`}>
                Vencimento
              </th>
              <th scope="col" className={headerCell}>
                Lançamento
              </th>
              <th scope="col" className={`${headerCell} w-36`}>
                Status
              </th>
              <th scope="col" className={`${headerCell} w-40 text-right`}>
                Valor
              </th>
              <th scope="col" className={`${headerCell} w-16`}>
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const status = TRANSACTION_STATUS[transaction.status];
              return (
                <tr
                  key={transaction.id}
                  className="bg-white hover:bg-neutral-50"
                >
                  <td className={`${cell} whitespace-nowrap`}>
                    {formatDate(transaction.dueDate)}
                  </td>
                  <td className={`${cell} max-w-0`}>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span
                        className={clsx(
                          'text-subtitle-s truncate text-neutral-900',
                          transaction.status === 'CANCELED' && 'line-through',
                        )}
                      >
                        {title(transaction)}
                      </span>
                      <span className="text-body-xs truncate text-neutral-600">
                        {subtitle(transaction)}
                      </span>
                    </div>
                  </td>
                  <td className={cell}>
                    <Badge color={status.color} size="s" dot>
                      {status.label}
                    </Badge>
                  </td>
                  <td
                    className={`${cell} text-subtitle-s text-right whitespace-nowrap text-neutral-900 tabular-nums`}
                  >
                    {signedAmount(transaction)}
                  </td>
                  <td className={cell}>
                    <div className="flex justify-end">
                      <TransactionActions
                        id={transaction.id}
                        name={title(transaction)}
                        amount={formatCurrency(transaction.amountCents)}
                        status={transaction.status}
                        variant="menu"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center gap-3 border-t border-neutral-100 py-3 pr-4 pl-5 sm:flex-row md:border-t-0">
        <p className="text-body-s flex-1 text-neutral-600">
          Mostrando {first}–{last} de {meta.total}
        </p>
        {meta.totalPages > 1 && <Pagination totalPages={meta.totalPages} />}
      </div>
    </>
  );
}

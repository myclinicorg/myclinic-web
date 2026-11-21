import { RiAddLine } from '@remixicon/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { requireClinic } from '@/app/lib/dal';
import {
  type CashflowFilters,
  currentMonth,
  fetchTransactionTypeCounts,
} from '@/app/lib/data';
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_STATUS,
  type TransactionCategory,
  type TransactionStatus,
} from '@/app/lib/definitions';
import { buttonClasses } from '@/app/ui/button';
import CashflowFiltersButton from '@/app/ui/cashflow/filters';
import {
  cashflowHref,
  type CashflowParams,
  type CashflowTab,
} from '@/app/ui/cashflow/links';
import MonthNav from '@/app/ui/cashflow/month-nav';
import CashflowStats from '@/app/ui/cashflow/stats';
import TransactionsTable, { TransactionsCount } from '@/app/ui/cashflow/table';
import PageHeader from '@/app/ui/page-header';
import { SkeletonLine, TableSkeleton } from '@/app/ui/skeletons';
import { StatGridSkeleton } from '@/app/ui/stat-card';
import TableCard from '@/app/ui/table-card';
import Tabs from '@/app/ui/tabs';

export const metadata: Metadata = {
  title: 'Caixa',
};

const TAB_TYPES = {
  todos: undefined,
  receitas: 'INCOME',
  despesas: 'EXPENSE',
} as const;
const TAB_TITLES = {
  todos: 'Todos os lançamentos',
  receitas: 'Receitas',
  despesas: 'Despesas',
};

function parseParams(
  params: Awaited<PageProps<'/painel/caixa'>['searchParams']>,
  fallbackMonth: string,
): CashflowParams & { page: number } {
  const month =
    typeof params.mes === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(params.mes)
      ? `${params.mes}-01`
      : fallbackMonth;
  const tab: CashflowTab =
    params.tipo === 'receitas' || params.tipo === 'despesas'
      ? params.tipo
      : 'todos';
  const status =
    typeof params.status === 'string' && params.status in TRANSACTION_STATUS
      ? (params.status as TransactionStatus)
      : undefined;
  const allowed =
    tab === 'todos'
      ? { ...TRANSACTION_CATEGORIES.INCOME, ...TRANSACTION_CATEGORIES.EXPENSE }
      : TRANSACTION_CATEGORIES[TAB_TYPES[tab]];
  const category =
    typeof params.categoria === 'string' && params.categoria in allowed
      ? (params.categoria as TransactionCategory)
      : undefined;
  return { month, tab, status, category, page: Number(params.page) || 1 };
}

async function CashflowTabs({ params }: { params: CashflowParams }) {
  const counts = await fetchTransactionTypeCounts(params);
  return (
    <Tabs
      label="Tipo"
      current={params.tab}
      tabs={[
        { name: 'Todos', value: 'todos', count: counts.all },
        { name: 'Receitas', value: 'receitas', count: counts.income },
        { name: 'Despesas', value: 'despesas', count: counts.expense },
      ].map((tab) => ({
        ...tab,
        href: cashflowHref({
          ...params,
          tab: tab.value as CashflowTab,
          category: undefined,
        }),
      }))}
    />
  );
}

async function Cashflow({
  searchParams,
}: {
  searchParams: PageProps<'/painel/caixa'>['searchParams'];
}) {
  await requireClinic();
  const { page, ...params } = parseParams(await searchParams, currentMonth());
  const filters: CashflowFilters = {
    month: params.month,
    type: TAB_TYPES[params.tab],
    status: params.status,
    category: params.category,
    page,
  };
  const key = JSON.stringify(filters);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonthNav params={params} />
        <CashflowFiltersButton params={params} />
      </div>
      <Suspense key={params.month} fallback={<StatGridSkeleton />}>
        <CashflowStats month={params.month} />
      </Suspense>
      <Suspense key={`tabs-${key}`} fallback={<div className="h-12" />}>
        <CashflowTabs params={params} />
      </Suspense>
      <TableCard
        title={TAB_TITLES[params.tab]}
        subtitle={
          <Suspense key={key} fallback="Carregando…">
            <TransactionsCount filters={filters} />
          </Suspense>
        }
      >
        <Suspense key={key} fallback={<TableSkeleton />}>
          <TransactionsTable filters={filters} />
        </Suspense>
      </TableCard>
    </>
  );
}

export default function Page(props: PageProps<'/painel/caixa'>) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Caixa"
        description="Receitas, despesas e o que ainda falta receber."
        actions={
          <Link href="/painel/caixa/novo" className={buttonClasses()}>
            <RiAddLine aria-hidden />
            Novo lançamento
          </Link>
        }
      />
      <Suspense
        fallback={
          <div className="border border-neutral-100 bg-white p-5">
            <SkeletonLine className="w-40" />
          </div>
        }
      >
        <Cashflow searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

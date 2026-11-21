import type {
  TransactionCategory,
  TransactionStatus,
} from '@/app/lib/definitions';

export type CashflowTab = 'todos' | 'receitas' | 'despesas';

export type CashflowParams = {
  month: string;
  tab: CashflowTab;
  status?: TransactionStatus;
  category?: TransactionCategory;
};

export function cashflowHref(params: CashflowParams) {
  const search = new URLSearchParams({ mes: params.month.slice(0, 7) });
  if (params.tab !== 'todos') search.set('tipo', params.tab);
  if (params.status) search.set('status', params.status);
  if (params.category) search.set('categoria', params.category);
  return `/painel/caixa?${search}`;
}

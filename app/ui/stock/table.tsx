import { RiArchiveLine } from '@remixicon/react';
import Link from 'next/link';
import { fetchFilteredSupplies, type StockTab } from '@/app/lib/data';
import { formatCurrency } from '@/app/lib/utils';
import EmptyState from '@/app/ui/empty-state';
import Pagination from '@/app/ui/pagination';
import { CreateSupply, SupplyActions } from '@/app/ui/stock/buttons';
import StockMeter from '@/app/ui/stock/stock-meter';

const headerCell =
  'h-11 border-b border-neutral-100 bg-neutral-50 px-4 text-left text-subtitle-s text-neutral-800';
const cell =
  'h-16 border-b border-neutral-100 px-4 text-body-s text-neutral-800';

const emptyStates = {
  todos: {
    title: 'Nenhum insumo ainda',
    description:
      'Cadastre os materiais que você usa para acompanhar o estoque.',
  },
  baixo: {
    title: 'Estoque em dia',
    description: 'Nenhum insumo ativo está no mínimo ou abaixo.',
  },
  inativos: {
    title: 'Nenhum insumo inativo',
    description: 'Insumos desativados aparecem aqui.',
  },
};

export async function SuppliesCount({
  tab,
  currentPage,
}: {
  tab: StockTab;
  currentPage: number;
}) {
  const { meta } = await fetchFilteredSupplies(tab, currentPage);
  return `${meta.total} ${meta.total === 1 ? 'insumo' : 'insumos'}`;
}

export default async function SuppliesTable({
  tab,
  currentPage,
}: {
  tab: StockTab;
  currentPage: number;
}) {
  const { data: supplies, meta } = await fetchFilteredSupplies(
    tab,
    currentPage,
  );

  if (meta.total === 0) {
    const empty = emptyStates[tab];
    return (
      <EmptyState
        icon={RiArchiveLine}
        title={empty.title}
        description={empty.description}
      >
        {tab === 'todos' && <CreateSupply />}
      </EmptyState>
    );
  }

  const first = (meta.page - 1) * meta.pageSize + 1;
  const last = first + supplies.length - 1;

  return (
    <>
      <ul className="md:hidden">
        {supplies.map((supply) => (
          <li
            key={supply.id}
            className="flex items-center gap-3 border-b border-neutral-100 last:border-b-0"
          >
            <Link
              href={`/painel/estoque/${supply.id}`}
              className="focus-visible:outline-brand-700 flex min-w-0 flex-1 flex-col gap-1.5 py-3 pl-4 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2"
            >
              <span className="text-subtitle-m truncate text-neutral-900">
                {supply.name}
              </span>
              <StockMeter
                name={supply.name}
                current={Number(supply.currentQuantity)}
                minimum={Number(supply.minQuantity)}
                unit={supply.unit}
              />
            </Link>
            <div className="pr-2">
              <SupplyActions
                id={supply.id}
                name={supply.name}
                variant="sheet"
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className={headerCell}>
                Insumo
              </th>
              <th scope="col" className={`${headerCell} w-72`}>
                Nível
              </th>
              <th scope="col" className={`${headerCell} w-36 text-right`}>
                Custo unitário
              </th>
              <th scope="col" className={`${headerCell} w-16`}>
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply) => (
              <tr key={supply.id} className="bg-white hover:bg-neutral-50">
                <td className={`${cell} max-w-0`}>
                  <Link
                    href={`/painel/estoque/${supply.id}`}
                    className="focus-visible:outline-brand-700 flex min-w-0 flex-col gap-0.5 focus-visible:outline-2"
                  >
                    <span className="text-subtitle-s truncate text-neutral-900">
                      {supply.name}
                    </span>
                    <span className="text-body-xs truncate text-neutral-600">
                      {supply.description || `Unidade: ${supply.unit}`}
                    </span>
                  </Link>
                </td>
                <td className={cell}>
                  <StockMeter
                    name={supply.name}
                    current={Number(supply.currentQuantity)}
                    minimum={Number(supply.minQuantity)}
                    unit={supply.unit}
                  />
                </td>
                <td
                  className={`${cell} text-right whitespace-nowrap tabular-nums`}
                >
                  {supply.unitCostCents !== null
                    ? formatCurrency(supply.unitCostCents)
                    : '—'}
                </td>
                <td className={cell}>
                  <div className="flex justify-end">
                    <SupplyActions
                      id={supply.id}
                      name={supply.name}
                      variant="menu"
                    />
                  </div>
                </td>
              </tr>
            ))}
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

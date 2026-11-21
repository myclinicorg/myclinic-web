import { RiStethoscopeLine } from '@remixicon/react';
import { fetchFilteredServices } from '@/app/lib/data';
import { formatCurrency, formatDuration } from '@/app/lib/utils';
import { Badge } from '@/app/ui/badge';
import EmptyState from '@/app/ui/empty-state';
import { List, ListItem } from '@/app/ui/list';
import Pagination from '@/app/ui/pagination';
import { CreateService, ServiceActions } from '@/app/ui/services/buttons';

const headerCell =
  'h-11 border-b border-neutral-100 bg-neutral-50 px-4 text-left text-subtitle-s text-neutral-800';
const cell =
  'h-16 border-b border-neutral-100 px-4 text-body-s text-neutral-800';

const emptyStates = {
  todos: {
    title: 'Nenhum serviço ainda',
    description: 'Cadastre os serviços que você oferece para usar na agenda.',
  },
  ativos: {
    title: 'Nenhum serviço ativo',
    description: 'Ative um serviço para que ele apareça na agenda.',
  },
  inativos: {
    title: 'Nenhum serviço inativo',
    description: 'Serviços desativados aparecem aqui.',
  },
};

export async function ServicesCount({
  status,
  currentPage,
}: {
  status: 'ativos' | 'inativos' | undefined;
  currentPage: number;
}) {
  const { meta } = await fetchFilteredServices(status, currentPage);
  return `${meta.total} ${meta.total === 1 ? 'serviço' : 'serviços'}`;
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <Badge color="success" size="s" dot>
      Ativo
    </Badge>
  ) : (
    <Badge color="gray" size="s" dot>
      Inativo
    </Badge>
  );
}

export default async function ServicesTable({
  status,
  currentPage,
}: {
  status: 'ativos' | 'inativos' | undefined;
  currentPage: number;
}) {
  const { data: services, meta } = await fetchFilteredServices(
    status,
    currentPage,
  );

  if (meta.total === 0) {
    const empty = emptyStates[status ?? 'todos'];
    return (
      <EmptyState
        icon={RiStethoscopeLine}
        title={empty.title}
        description={empty.description}
      >
        {!status && <CreateService />}
      </EmptyState>
    );
  }

  const first = (meta.page - 1) * meta.pageSize + 1;
  const last = first + services.length - 1;

  return (
    <>
      <div className="md:hidden">
        <List>
          {services.map((service) => (
            <ListItem
              key={service.id}
              href={`/painel/servicos/${service.id}/editar`}
              leading={
                <span className="bg-brand-100 flex size-8 shrink-0 items-center justify-center rounded-full">
                  <RiStethoscopeLine
                    aria-hidden
                    className="text-brand-700 size-4"
                  />
                </span>
              }
              title={service.name}
              description={`${formatDuration(service.durationMinutes)}${service.active ? '' : ' · Inativo'}`}
              meta={formatCurrency(service.priceCents)}
              actions={
                <ServiceActions
                  id={service.id}
                  name={service.name}
                  variant="sheet"
                />
              }
            />
          ))}
        </List>
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className={headerCell}>
                Serviço
              </th>
              <th scope="col" className={headerCell}>
                Duração
              </th>
              <th scope="col" className={`${headerCell} text-right`}>
                Preço
              </th>
              <th scope="col" className={headerCell}>
                Status
              </th>
              <th scope="col" className={`${headerCell} w-16 text-right`}>
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="bg-white hover:bg-neutral-50">
                <td className={`${cell} w-full max-w-0`}>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-subtitle-s truncate text-neutral-900">
                      {service.name}
                    </span>
                    <span className="text-body-xs truncate text-neutral-600">
                      {service.description ??
                        formatDuration(service.durationMinutes)}
                    </span>
                  </div>
                </td>
                <td className={`${cell} whitespace-nowrap`}>
                  {formatDuration(service.durationMinutes)}
                </td>
                <td
                  className={`${cell} text-right whitespace-nowrap text-neutral-900`}
                >
                  {formatCurrency(service.priceCents)}
                </td>
                <td className={cell}>
                  <StatusBadge active={service.active} />
                </td>
                <td className={cell}>
                  <div className="flex justify-end">
                    <ServiceActions
                      id={service.id}
                      name={service.name}
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

import { RiStethoscopeLine } from '@remixicon/react';
import { fetchFilteredServices } from '@/app/lib/data';
import { formatCurrency, formatDuration } from '@/app/lib/utils';
import { Badge } from '@/app/ui/badge';
import EmptyState from '@/app/ui/empty-state';
import Pagination from '@/app/ui/pagination';
import {
  CreateService,
  DeleteService,
  UpdateService,
} from '@/app/ui/services/buttons';

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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className={headerCell}>
                Serviço
              </th>
              <th scope="col" className={`${headerCell} hidden md:table-cell`}>
                Duração
              </th>
              <th scope="col" className={`${headerCell} text-right`}>
                Preço
              </th>
              <th scope="col" className={`${headerCell} hidden sm:table-cell`}>
                Status
              </th>
              <th scope="col" className={`${headerCell} w-28 text-right`}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="bg-white">
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
                <td
                  className={`${cell} hidden whitespace-nowrap md:table-cell`}
                >
                  {formatDuration(service.durationMinutes)}
                </td>
                <td
                  className={`${cell} text-right whitespace-nowrap text-neutral-900`}
                >
                  {formatCurrency(service.priceCents)}
                </td>
                <td className={`${cell} hidden sm:table-cell`}>
                  {service.active ? (
                    <Badge color="success" size="s" dot>
                      Ativo
                    </Badge>
                  ) : (
                    <Badge color="gray" size="s" dot>
                      Inativo
                    </Badge>
                  )}
                </td>
                <td className={cell}>
                  <div className="flex justify-end">
                    <UpdateService id={service.id} name={service.name} />
                    <DeleteService id={service.id} name={service.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 py-3 pr-4 pl-5 sm:flex-row sm:items-center">
        <p className="text-body-s flex-1 text-neutral-600">
          Mostrando {first}–{last} de {meta.total}
        </p>
        {meta.totalPages > 1 && <Pagination totalPages={meta.totalPages} />}
      </div>
    </>
  );
}

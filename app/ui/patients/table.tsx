import { RiSearchLine, RiTeamLine } from '@remixicon/react';
import { fetchFilteredPatients } from '@/app/lib/data';
import { formatCpf, formatDate, formatPhone } from '@/app/lib/utils';
import Avatar from '@/app/ui/avatar';
import EmptyState from '@/app/ui/empty-state';
import Pagination from '@/app/ui/pagination';
import {
  CreatePatient,
  DeletePatient,
  UpdatePatient,
} from '@/app/ui/patients/buttons';

const headerCell =
  'h-11 border-b border-neutral-100 bg-neutral-50 px-4 text-left text-subtitle-s text-neutral-800';
const cell =
  'h-16 border-b border-neutral-100 px-4 text-body-s text-neutral-800';

export default async function PatientsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { data: patients, meta } = await fetchFilteredPatients(
    query,
    currentPage,
  );

  if (meta.total === 0) {
    return query ? (
      <EmptyState
        icon={RiSearchLine}
        title="Nenhum paciente encontrado"
        description={`Nada corresponde a “${query}”. Tente outro nome ou CPF.`}
      />
    ) : (
      <EmptyState
        icon={RiTeamLine}
        title="Nenhum paciente ainda"
        description="Cadastre o primeiro paciente para começar a montar a agenda."
      >
        <CreatePatient />
      </EmptyState>
    );
  }

  const first = (meta.page - 1) * meta.pageSize + 1;
  const last = first + patients.length - 1;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className={headerCell}>
                Paciente
              </th>
              <th scope="col" className={`${headerCell} hidden md:table-cell`}>
                CPF
              </th>
              <th scope="col" className={`${headerCell} hidden lg:table-cell`}>
                Telefone
              </th>
              <th scope="col" className={`${headerCell} hidden lg:table-cell`}>
                Nascimento
              </th>
              <th scope="col" className={`${headerCell} w-28 text-right`}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="bg-white">
                <td className={cell}>
                  <div className="flex items-center gap-3">
                    <Avatar name={patient.fullName} />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-subtitle-s truncate text-neutral-900">
                        {patient.fullName}
                      </span>
                      <span className="text-body-xs truncate text-neutral-600">
                        {patient.email ?? formatCpf(patient.cpf)}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  className={`${cell} hidden whitespace-nowrap md:table-cell`}
                >
                  {formatCpf(patient.cpf)}
                </td>
                <td
                  className={`${cell} hidden whitespace-nowrap lg:table-cell`}
                >
                  {patient.phone ? formatPhone(patient.phone) : '—'}
                </td>
                <td
                  className={`${cell} hidden whitespace-nowrap lg:table-cell`}
                >
                  {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : '—'}
                </td>
                <td className={cell}>
                  <div className="flex justify-end">
                    <UpdatePatient id={patient.id} name={patient.fullName} />
                    <DeletePatient id={patient.id} name={patient.fullName} />
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

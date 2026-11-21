import { RiSearchLine, RiTeamLine } from '@remixicon/react';
import Link from 'next/link';
import { fetchFilteredPatients } from '@/app/lib/data';
import type { Patient } from '@/app/lib/definitions';
import { formatCpf, formatDate, formatPhone } from '@/app/lib/utils';
import Avatar from '@/app/ui/avatar';
import EmptyState from '@/app/ui/empty-state';
import { List, ListItem } from '@/app/ui/list';
import Pagination from '@/app/ui/pagination';
import { CreatePatient, PatientActions } from '@/app/ui/patients/buttons';

const headerCell =
  'h-11 border-b border-neutral-100 bg-neutral-50 px-4 text-left text-subtitle-s text-neutral-800';
const cell =
  'h-16 border-b border-neutral-100 px-4 text-body-s text-neutral-800';

function contact(patient: Patient) {
  if (patient.phone) return formatPhone(patient.phone);
  return patient.email ?? 'Sem contato';
}

export async function PatientsCount({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { meta } = await fetchFilteredPatients(query, currentPage);
  const noun = meta.total === 1 ? 'paciente' : 'pacientes';
  return query
    ? `${meta.total} ${noun} encontrado${meta.total === 1 ? '' : 's'}`
    : `${meta.total} ${noun}`;
}

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
      <div className="md:hidden">
        <List>
          {patients.map((patient) => (
            <ListItem
              key={patient.id}
              href={`/painel/pacientes/${patient.id}`}
              leading={<Avatar name={patient.fullName} size="m" />}
              title={patient.fullName}
              description={contact(patient)}
              actions={
                <PatientActions
                  id={patient.id}
                  name={patient.fullName}
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
                Paciente
              </th>
              <th scope="col" className={headerCell}>
                CPF
              </th>
              <th scope="col" className={`${headerCell} hidden lg:table-cell`}>
                Nascimento
              </th>
              <th scope="col" className={`${headerCell} w-16 text-right`}>
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="bg-white hover:bg-neutral-50">
                <td className={cell}>
                  <Link
                    href={`/painel/pacientes/${patient.id}`}
                    className="focus-visible:outline-brand-700 flex items-center gap-3 focus-visible:outline-2"
                  >
                    <Avatar name={patient.fullName} />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-subtitle-s truncate text-neutral-900">
                        {patient.fullName}
                      </span>
                      <span className="text-body-xs truncate text-neutral-600">
                        {contact(patient)}
                      </span>
                    </div>
                  </Link>
                </td>
                <td className={`${cell} whitespace-nowrap`}>
                  {formatCpf(patient.cpf)}
                </td>
                <td
                  className={`${cell} hidden whitespace-nowrap lg:table-cell`}
                >
                  {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : '—'}
                </td>
                <td className={cell}>
                  <div className="flex justify-end">
                    <PatientActions
                      id={patient.id}
                      name={patient.fullName}
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

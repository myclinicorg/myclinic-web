import type { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import PageHeader from '@/app/ui/page-header';
import PatientForm from '@/app/ui/patients/patient-form';

export const metadata: Metadata = {
  title: 'Novo paciente',
};

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: 'Pacientes', href: '/painel/pacientes' },
          { label: 'Novo paciente' },
        ]}
      />
      <PageHeader
        title="Novo paciente"
        description="Só nome e CPF são obrigatórios."
      />
      <PatientForm />
    </div>
  );
}

import type { Metadata } from 'next';
import PageHeader from '@/app/ui/page-header';
import PatientForm from '@/app/ui/patients/patient-form';

export const metadata: Metadata = {
  title: 'Novo paciente',
};

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Novo paciente"
        description="Só nome e CPF são obrigatórios."
      />
      <PatientForm />
    </div>
  );
}

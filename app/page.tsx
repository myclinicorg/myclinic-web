export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6">
      <div className="shadow-card bg-white p-8 text-center">
        <p className="text-eyebrow text-brand-700 uppercase">MyClinic</p>
        <h1 className="text-heading-3 mt-2 text-neutral-900">
          Gestão para profissionais da saúde
        </h1>
        <p className="text-body-l mt-3 text-neutral-600">
          Pacientes, agenda, estoque e fluxo de caixa em um só lugar.
        </p>
      </div>
    </main>
  );
}

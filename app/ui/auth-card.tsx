import MyClinicLogo from '@/app/ui/myclinic-logo';

export default function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="shadow-card w-full max-w-100 bg-white p-8">
        <MyClinicLogo />
        <h1 className="text-heading-4 mt-8 text-neutral-900">{title}</h1>
        <p className="text-body-s mt-2 mb-6 text-neutral-600">{description}</p>
        {children}
      </div>
    </main>
  );
}

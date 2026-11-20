import Link from 'next/link';
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
    <main className="flex min-h-screen flex-col items-center justify-between gap-12 bg-neutral-50 px-4 py-12 md:p-12">
      <Link href="/" aria-label="MyClinic — início">
        <MyClinicLogo />
      </Link>
      <div className="shadow-card flex w-full max-w-110 flex-col gap-6 border border-neutral-100 bg-white p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-4 text-neutral-900">{title}</h1>
          <p className="text-body-m text-neutral-600">{description}</p>
        </div>
        {children}
      </div>
      <p className="text-body-s text-neutral-600">© 2026 MyClinic</p>
    </main>
  );
}

export function AuthFooter({
  text,
  linkLabel,
  href,
}: {
  text: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <p className="text-body-s flex items-center justify-center gap-1 text-neutral-600">
      {text}
      <Link href={href} className="text-brand-700 hover:underline">
        {linkLabel}
      </Link>
    </p>
  );
}

import Link from 'next/link';
import { buttonClasses } from '@/app/ui/button';
import MyClinicLogo from '@/app/ui/myclinic-logo';

const navLinks = [
  { name: 'Recursos', href: '/#recursos' },
  { name: 'Como funciona', href: '/#como-funciona' },
  { name: 'Dúvidas', href: '/#duvidas' },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white">
      <div className="mx-auto flex h-16 max-w-360 items-center gap-8 px-4 md:h-20 md:px-20">
        <Link href="/" aria-label="MyClinic — início">
          <MyClinicLogo />
        </Link>
        <nav
          aria-label="Site"
          className="hidden flex-1 items-center justify-center gap-8 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-menu-m hover:text-brand-700 py-2 text-neutral-800"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link
            href="/entrar"
            className={buttonClasses({
              hierarchy: 'tertiary',
              color: 'gray',
              size: 's',
            })}
          >
            Entrar
          </Link>
          <Link href="/cadastro" className={buttonClasses({ size: 's' })}>
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  );
}

import Link from 'next/link';

const footerLinks = [
  { name: 'Recursos', href: '/#recursos' },
  { name: 'Dúvidas', href: '/#duvidas' },
  { name: 'Entrar', href: '/entrar' },
  { name: 'Criar conta', href: '/cadastro' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-100 bg-neutral-50">
      <div className="mx-auto flex max-w-360 flex-col-reverse items-center gap-4 px-4 py-8 md:flex-row md:justify-between md:px-20">
        <p className="text-body-xs text-neutral-600">
          © 2026 MyClinic. Todos os direitos reservados.
        </p>
        <nav
          aria-label="Rodapé"
          className="text-body-s flex flex-wrap justify-center gap-x-8 gap-y-2 text-neutral-800"
        >
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

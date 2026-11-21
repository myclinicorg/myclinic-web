import {
  RiArrowRightLine,
  RiDashboardLine,
  RiErrorWarningLine,
  RiLoginBoxLine,
  RiQuestionLine,
} from '@remixicon/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonClasses } from '@/app/ui/button';
import SectionHeading from '@/app/ui/home/section-heading';
import SiteFooter from '@/app/ui/home/site-footer';
import SiteHeader from '@/app/ui/home/site-header';

export const metadata: Metadata = {
  title: 'Página não encontrada',
};

const pages = [
  {
    icon: RiDashboardLine,
    title: 'Painel',
    description: 'Agenda, pacientes, caixa e estoque da sua clínica.',
    href: '/painel',
    label: 'Ir para o painel',
  },
  {
    icon: RiLoginBoxLine,
    title: 'Entrar',
    description: 'Acesse sua conta com e-mail e senha.',
    href: '/entrar',
    label: 'Entrar na conta',
  },
  {
    icon: RiQuestionLine,
    title: 'Dúvidas',
    description: 'Respostas para as perguntas mais comuns.',
    href: '/#duvidas',
    label: 'Ver dúvidas',
  },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="flex flex-col items-center gap-6 px-4 py-16 text-center md:py-32">
          <span className="text-body-s bg-brand-100 text-brand-900 inline-flex h-6 items-center gap-1.5 rounded-full px-2.5">
            <RiErrorWarningLine aria-hidden className="size-4" />
            Erro 404
          </span>
          <h1 className="text-heading-3 md:text-heading-1 text-neutral-900">
            Não encontramos esta página
          </h1>
          <p className="text-body-m md:text-body-l max-w-150 text-neutral-600">
            A página que você procura foi movida, excluída ou nunca existiu.
            Volte ao início ou tente uma das páginas abaixo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className={buttonClasses({ size: 'l' })}>
              Ir para o início
            </Link>
            <Link
              href="/painel"
              className={buttonClasses({ hierarchy: 'secondary', size: 'l' })}
            >
              Abrir o painel
            </Link>
          </div>
        </section>
        <section
          aria-labelledby="paginas-titulo"
          className="bg-neutral-50 px-4 py-16 md:px-20 md:py-24"
        >
          <div className="mx-auto flex max-w-320 flex-col gap-12">
            <SectionHeading
              id="paginas-titulo"
              title="Páginas mais acessadas"
              description="Elas podem ajudar você a encontrar o que precisa."
            />
            <ul className="grid gap-6 md:grid-cols-3 md:gap-10">
              {pages.map((page) => (
                <li
                  key={page.href}
                  className="flex flex-col items-start gap-4 border border-neutral-100 bg-white p-6"
                >
                  <div className="bg-brand-100 text-brand-700 flex size-12 items-center justify-center">
                    <page.icon aria-hidden className="size-6" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-heading-6 text-neutral-900">
                      {page.title}
                    </h3>
                    <p className="text-body-s text-neutral-600">
                      {page.description}
                    </p>
                    <Link
                      href={page.href}
                      className="text-body-s text-brand-700 inline-flex items-center gap-1 hover:underline"
                    >
                      {page.label}
                      <RiArrowRightLine aria-hidden className="size-4" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import {
  RiArchiveLine,
  RiCalendarLine,
  RiDashboardLine,
  RiSmartphoneLine,
  RiStethoscopeLine,
  RiTeamLine,
  RiTimeLine,
  RiWallet3Line,
} from '@remixicon/react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/app/ui/badge';
import { buttonClasses } from '@/app/ui/button';
import Faq from '@/app/ui/home/faq';
import FeatureItem from '@/app/ui/home/feature-item';
import SectionHeading from '@/app/ui/home/section-heading';
import SiteFooter from '@/app/ui/home/site-footer';
import SiteHeader from '@/app/ui/home/site-header';
import painel from '@/public/painel.jpg';

const features = [
  {
    icon: RiTeamLine,
    title: 'Pacientes',
    description:
      'Cadastro completo com contato e endereço, e o histórico de atendimentos de cada paciente.',
  },
  {
    icon: RiCalendarLine,
    title: 'Agenda',
    description:
      'Visão por mês ou semana, respeitando o expediente da clínica e evitando horários em conflito.',
  },
  {
    icon: RiStethoscopeLine,
    title: 'Serviços',
    description:
      'Consultas e procedimentos com preço e duração, prontos para escolher ao agendar.',
  },
  {
    icon: RiWallet3Line,
    title: 'Caixa',
    description:
      'Receitas e despesas com forma de pagamento. Concluir um atendimento já lança a receita.',
  },
  {
    icon: RiArchiveLine,
    title: 'Estoque',
    description:
      'Insumos com quantidade mínima, alerta de estoque baixo e histórico de entradas e saídas.',
  },
  {
    icon: RiDashboardLine,
    title: 'Visão geral',
    description:
      'Atendimentos do dia, valores recebidos e a receber e gráficos do mês em uma só tela.',
  },
];

const steps = [
  {
    title: 'Crie sua conta',
    description: 'Informe nome, e-mail e uma senha. Leva menos de um minuto.',
  },
  {
    title: 'Cadastre a clínica',
    description:
      'Dados, endereço e expediente em etapas curtas, com tudo salvo ao final.',
  },
  {
    title: 'Comece a atender',
    description:
      'Cadastre serviços e pacientes e marque o primeiro atendimento na agenda.',
  },
];

const highlights = [
  {
    icon: RiSmartphoneLine,
    title: 'Funciona no celular',
    description: 'Use no computador ou no celular, direto no navegador.',
  },
  {
    icon: RiTimeLine,
    title: 'Menos planilhas',
    description: 'Agenda, caixa e estoque conversam entre si.',
  },
];

const faq = [
  {
    question: 'Preciso instalar algum programa?',
    answer:
      'Não. O MyClinic funciona no navegador, no computador ou no celular. Basta criar a conta e entrar.',
  },
  {
    question: 'Para quem é o MyClinic?',
    answer:
      'Para profissionais da saúde e pequenas clínicas que querem organizar pacientes, agenda, estoque e o caixa em um só lugar.',
  },
  {
    question: 'Como o caixa é preenchido?',
    answer:
      'Ao concluir um atendimento você informa a forma de pagamento e a receita é lançada automaticamente. Despesas e outras receitas podem ser lançadas à mão.',
  },
  {
    question: 'Outras pessoas veem os dados da minha clínica?',
    answer:
      'Não. O acesso é feito com e-mail e senha, e cada conta vê apenas os dados da própria clínica.',
  },
  {
    question: 'Esqueci minha senha. E agora?',
    answer:
      'Na tela de entrada, use "Esqueci a senha" para receber por e-mail um link de redefinição.',
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto grid max-w-360 items-center gap-12 px-4 py-12 md:px-20 md:py-20 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col items-start gap-6">
            <Badge color="brand" variant="light">
              Para profissionais da saúde
            </Badge>
            <h1 className="text-heading-3 md:text-heading-1 text-neutral-900">
              Sua clínica organizada em um só lugar
            </h1>
            <p className="text-body-m md:text-body-l text-neutral-600">
              Pacientes, agenda, estoque e fluxo de caixa juntos, para você
              gastar menos tempo com planilhas e mais tempo com quem atende.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/cadastro" className={buttonClasses({ size: 'l' })}>
                Criar conta
              </Link>
              <Link
                href="/entrar"
                className={buttonClasses({ hierarchy: 'secondary', size: 'l' })}
              >
                Entrar
              </Link>
            </div>
          </div>
          <div className="shadow-card overflow-hidden border border-neutral-100 bg-white">
            <div className="flex h-8 items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-3">
              <span className="size-2.5 rounded-full bg-neutral-200" />
              <span className="size-2.5 rounded-full bg-neutral-200" />
              <span className="size-2.5 rounded-full bg-neutral-200" />
            </div>
            <Image
              src={painel}
              alt="Tela de visão geral do MyClinic com atendimentos, valores do mês, gráfico de receitas e despesas e próximos atendimentos"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </section>

        <section
          id="recursos"
          aria-labelledby="recursos-titulo"
          className="scroll-mt-20 bg-white"
        >
          <div className="mx-auto flex max-w-360 flex-col gap-12 px-4 py-16 md:px-20 md:py-24">
            <SectionHeading
              id="recursos-titulo"
              eyebrow="Recursos"
              title="Tudo o que a rotina da clínica pede"
              description="Cada parte do MyClinic foi pensada para o dia a dia de quem atende pacientes."
            />
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <FeatureItem key={feature.title} {...feature} />
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/cadastro" className={buttonClasses()}>
                Começar agora
              </Link>
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          aria-labelledby="como-funciona-titulo"
          className="scroll-mt-20 bg-neutral-50"
        >
          <div className="mx-auto grid max-w-360 gap-12 px-4 py-16 md:px-20 md:py-24 lg:grid-cols-2">
            <div className="flex flex-col gap-10">
              <SectionHeading
                id="como-funciona-titulo"
                eyebrow="Como funciona"
                title="Pronto para usar em poucos minutos"
                description="Sem instalação e sem configuração complicada."
                align="left"
              />
              <div className="grid gap-8 sm:grid-cols-2">
                {highlights.map((item) => (
                  <FeatureItem key={item.title} {...item} />
                ))}
              </div>
            </div>
            <ol className="flex flex-col gap-4">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-4 border border-neutral-100 bg-white p-6"
                >
                  <span className="bg-brand-700 text-heading-6 flex size-12 shrink-0 items-center justify-center text-white">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-heading-6 text-neutral-900">
                      {step.title}
                    </h3>
                    <p className="text-body-s text-neutral-600">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="duvidas"
          aria-labelledby="duvidas-titulo"
          className="scroll-mt-20"
        >
          <div className="mx-auto flex max-w-360 flex-col gap-12 px-4 py-16 md:px-20 md:py-24">
            <SectionHeading
              id="duvidas-titulo"
              eyebrow="Dúvidas"
              title="Perguntas frequentes"
              description="O que você precisa saber antes de começar."
            />
            <Faq items={faq} />
          </div>
        </section>

        <section
          aria-labelledby="cta-titulo"
          className="px-4 pb-16 md:px-20 md:pb-24"
        >
          <div className="mx-auto max-w-320 bg-neutral-50 px-4 py-16 md:px-12">
            <SectionHeading
              id="cta-titulo"
              eyebrow="Comece agora"
              title="Organize sua clínica hoje"
              description="Crie sua conta e cadastre a clínica em poucos passos."
            >
              <Link href="/cadastro" className={buttonClasses({ size: 'l' })}>
                Criar conta
              </Link>
              <Link
                href="/entrar"
                className={buttonClasses({ hierarchy: 'secondary', size: 'l' })}
              >
                Já tenho conta
              </Link>
            </SectionHeading>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from 'next';
import '@/app/ui/global.css';
import { roboto } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: {
    template: '%s | MyClinic',
    default: 'MyClinic',
  },
  description:
    'Gestão de pacientes, agenda, estoque e fluxo de caixa para profissionais da saúde.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={`${roboto.className} text-body-m flex min-h-full flex-col bg-white text-neutral-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

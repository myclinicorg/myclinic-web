import { Roboto, Roboto_Mono } from 'next/font/google';

export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const robotoMono = Roboto_Mono({ subsets: ['latin'] });

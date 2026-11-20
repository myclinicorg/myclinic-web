import 'server-only';
import { cookies } from 'next/headers';

export const FLASH_COOKIE = 'flash';

export async function setFlash(message: string) {
  const cookieStore = await cookies();
  cookieStore.set(FLASH_COOKIE, message, {
    maxAge: 30,
    path: '/',
    sameSite: 'lax',
  });
}

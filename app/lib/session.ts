import 'server-only';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'session';

const API_SESSION_COOKIES = ['__Host-sid', 'sid'];

export async function createSession(token: string, expires?: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export function readApiSession(response: Response) {
  for (const header of response.headers.getSetCookie()) {
    const [pair, ...attributes] = header.split(';').map((part) => part.trim());
    const separator = pair.indexOf('=');
    const name = pair.slice(0, separator);
    if (!API_SESSION_COOKIES.includes(name)) continue;

    const token = pair.slice(separator + 1);
    let expires: Date | undefined;
    for (const attribute of attributes) {
      const [key, value] = attribute.split('=');
      if (key.toLowerCase() === 'max-age') {
        expires = new Date(Date.now() + Number(value) * 1000);
      } else if (key.toLowerCase() === 'expires' && !expires) {
        expires = new Date(value);
      }
    }
    return { token, expires };
  }
  return null;
}

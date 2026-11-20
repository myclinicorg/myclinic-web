import 'server-only';
import createClient from 'openapi-fetch';
import type { paths } from '@/app/lib/api-schema';
import { getSessionToken } from '@/app/lib/session';

export const api = createClient<paths>({ baseUrl: process.env.API_URL });

api.use({
  async onRequest({ request }) {
    const token = await getSessionToken();
    if (token) {
      request.headers.set('Cookie', `__Host-sid=${token}`);
    }
    return request;
  },
});

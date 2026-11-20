import { redirect } from 'next/navigation';
import { deleteSession } from '@/app/lib/session';

export async function GET() {
  await deleteSession();
  redirect('/login');
}

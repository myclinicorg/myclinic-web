import { RiLogoutBoxRLine, RiSettingsLine } from '@remixicon/react';
import Link from 'next/link';
import { logout } from '@/app/lib/actions';
import { getCurrentUser } from '@/app/lib/dal';
import Avatar from '@/app/ui/avatar';

const iconButton =
  'flex size-10 items-center justify-center text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-brand-700';

export default async function QuickActions() {
  const user = await getCurrentUser();

  return (
    <div className="flex items-center gap-1">
      <span title={`${user.name} · ${user.email}`}>
        <Avatar name={user.name} />
      </span>
      <Link
        href="/painel/clinica"
        aria-label="Dados da clínica"
        title="Dados da clínica"
        className={iconButton}
      >
        <RiSettingsLine aria-hidden className="size-5" />
      </Link>
      <form action={logout}>
        <button
          type="submit"
          aria-label="Sair"
          title="Sair"
          className={iconButton}
        >
          <RiLogoutBoxRLine aria-hidden className="size-5" />
        </button>
      </form>
    </div>
  );
}

export function QuickActionsSkeleton() {
  return (
    <div className="flex h-10 items-center gap-1">
      <div className="size-8 rounded-full bg-neutral-100" />
    </div>
  );
}

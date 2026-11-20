import { RiLogoutBoxRLine } from '@remixicon/react';
import { logout } from '@/app/lib/actions';
import { getCurrentUser } from '@/app/lib/dal';
import Avatar from '@/app/ui/avatar';

export default async function UserCard() {
  const user = await getCurrentUser();

  return (
    <div className="flex w-full items-center gap-3 p-2">
      <Avatar name={user.name} size="m" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-subtitle-s truncate text-neutral-900">{user.name}</p>
        <p className="text-body-xs truncate text-neutral-600">{user.email}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          aria-label="Sair"
          title="Sair"
          className="focus-visible:outline-brand-700 flex size-10 items-center justify-center text-neutral-700 hover:bg-neutral-50 focus-visible:outline-2"
        >
          <RiLogoutBoxRLine aria-hidden className="size-5" />
        </button>
      </form>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="flex w-full items-center gap-3 p-2">
      <div className="size-10 shrink-0 rounded-full bg-neutral-100" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 w-3/4 bg-neutral-100" />
        <div className="h-3 w-1/2 bg-neutral-100" />
      </div>
    </div>
  );
}

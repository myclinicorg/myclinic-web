import Link from 'next/link';
import { Suspense } from 'react';
import NavLinks from '@/app/ui/dashboard/nav-links';
import UserCard, { UserCardSkeleton } from '@/app/ui/dashboard/user-card';
import MyClinicLogo from '@/app/ui/myclinic-logo';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col gap-4 border-r border-neutral-100 bg-white p-4">
      <Link href="/dashboard" className="py-1">
        <MyClinicLogo />
      </Link>
      <nav aria-label="Principal" className="flex flex-col gap-1">
        <NavLinks />
      </nav>
      <div className="flex-1" />
      <Suspense fallback={<UserCardSkeleton />}>
        <UserCard />
      </Suspense>
    </div>
  );
}

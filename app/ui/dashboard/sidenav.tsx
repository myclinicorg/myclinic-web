import Link from 'next/link';
import { Suspense } from 'react';
import NavLinks, { NavLinksView } from '@/app/ui/dashboard/nav-links';
import PatientSearch from '@/app/ui/dashboard/patient-search';
import QuickActions, {
  QuickActionsSkeleton,
} from '@/app/ui/dashboard/quick-actions';
import MyClinicLogo from '@/app/ui/myclinic-logo';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col gap-4 border-r border-neutral-100 bg-white p-4">
      <div className="flex flex-col gap-4">
        <Link href="/painel">
          <MyClinicLogo />
        </Link>
        <Suspense fallback={<QuickActionsSkeleton />}>
          <QuickActions />
        </Suspense>
        <PatientSearch />
      </div>
      <nav aria-label="Principal" className="flex flex-col gap-1">
        <Suspense fallback={<NavLinksView />}>
          <NavLinks />
        </Suspense>
      </nav>
    </div>
  );
}

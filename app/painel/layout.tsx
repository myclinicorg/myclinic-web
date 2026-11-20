import { Suspense } from 'react';
import MobileBottomNav, {
  MobileBottomNavView,
} from '@/app/ui/dashboard/mobile-bottom-nav';
import MobileTopBar, {
  MobileTopBarView,
} from '@/app/ui/dashboard/mobile-top-bar';
import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: LayoutProps<'/painel'>) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 md:flex-row">
      <aside className="hidden w-64 shrink-0 md:sticky md:top-0 md:block md:h-screen">
        <SideNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<MobileTopBarView />}>
          <MobileTopBar />
        </Suspense>
        <main className="flex-1 px-4 pt-6 pb-28 md:px-10 md:pt-8 md:pb-10">
          {children}
        </main>
      </div>
      <Suspense fallback={<MobileBottomNavView />}>
        <MobileBottomNav />
      </Suspense>
    </div>
  );
}

import MobileBottomNav from '@/app/ui/dashboard/mobile-bottom-nav';
import MobileTopBar from '@/app/ui/dashboard/mobile-top-bar';
import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 md:flex-row">
      <aside className="hidden w-64 shrink-0 md:sticky md:top-0 md:block md:h-screen">
        <SideNav />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 p-4 pb-28 md:p-8">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function TableCard({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-neutral-100 bg-white">
      <div className="flex flex-col gap-3 border-b border-neutral-100 py-4 pr-4 pl-5 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="text-subtitle-m text-neutral-900">{title}</h2>
          {subtitle && (
            <p className="text-body-xs text-neutral-600">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {actions}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}

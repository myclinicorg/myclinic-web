export default function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:gap-10">
      <div className="flex flex-col gap-1 lg:w-70 lg:shrink-0">
        <h2 className="text-subtitle-m text-neutral-900">{title}</h2>
        {description && (
          <p className="text-body-s text-neutral-600">{description}</p>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-5 border border-neutral-100 bg-white p-6">
        {children}
      </div>
    </section>
  );
}

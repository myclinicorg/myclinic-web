export default function OrderSummary({
  title,
  lines,
  total,
  children,
}: {
  title: string;
  lines: { label: string; value: React.ReactNode }[];
  total: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 bg-neutral-50 p-6">
      <h2 className="text-heading-6 text-neutral-900">{title}</h2>
      <dl className="text-body-s flex flex-col gap-3">
        {lines.map((line) => (
          <div key={line.label} className="flex items-start gap-2">
            <dt className="min-w-0 flex-1 text-neutral-800">{line.label}</dt>
            <dd className="shrink-0 text-neutral-900">{line.value}</dd>
          </div>
        ))}
      </dl>
      <hr className="border-neutral-100" />
      <div className="flex items-center gap-2 text-neutral-900">
        <p className="text-subtitle-m flex-1">Total</p>
        <p className="text-heading-5">{total}</p>
      </div>
      {children}
    </section>
  );
}

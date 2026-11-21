interface OptionCardProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'title'
> {
  title: string;
  description?: string;
  meta?: React.ReactNode;
}

export default function OptionCard({
  title,
  description,
  meta,
  ...rest
}: OptionCardProps) {
  return (
    <label className="has-checked:border-brand-700 has-checked:bg-brand-50 has-checked:ring-brand-700 has-focus-visible:outline-brand-700 flex cursor-pointer items-start gap-4 border border-neutral-200 bg-white px-5 py-4 has-checked:ring-1 has-checked:ring-inset has-focus-visible:outline-2 has-focus-visible:outline-offset-2">
      <span className="relative flex shrink-0 p-0.5">
        <input
          type="radio"
          className="peer checked:border-brand-700 size-5 cursor-pointer appearance-none rounded-full border-[1.5px] border-neutral-700 bg-white focus-visible:outline-none"
          {...rest}
        />
        <span
          aria-hidden
          className="bg-brand-700 pointer-events-none absolute inset-0 m-auto hidden size-2.5 rounded-full peer-checked:block"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-subtitle-m text-neutral-900">{title}</span>
        {description && (
          <span className="text-body-s text-neutral-600">{description}</span>
        )}
      </span>
      {meta && (
        <span className="text-subtitle-m shrink-0 text-neutral-900">
          {meta}
        </span>
      )}
    </label>
  );
}

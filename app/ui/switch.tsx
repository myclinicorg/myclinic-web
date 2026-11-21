interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'role'
> {
  label: string;
  helperText?: string;
}

export default function Switch({
  label,
  helperText,
  id,
  ...rest
}: SwitchProps) {
  const helperId = helperText && id ? `${id}-helper` : undefined;

  return (
    <label className="flex cursor-pointer items-start gap-3 has-disabled:cursor-not-allowed">
      <span className="relative flex shrink-0 py-0.5">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-describedby={helperId}
          className="peer checked:bg-brand-700 focus-visible:outline-brand-700 h-5 w-10 cursor-pointer appearance-none rounded-full bg-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-100"
          {...rest}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-1 left-0.5 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-body-m text-neutral-800 in-has-disabled:text-neutral-400">
          {label}
        </span>
        {helperText && (
          <span
            id={helperId}
            className="text-body-s text-neutral-600 in-has-disabled:text-neutral-400"
          >
            {helperText}
          </span>
        )}
      </span>
    </label>
  );
}

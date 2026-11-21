interface ChipRadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label: string;
}

export function ChipRadio({ label, ...rest }: ChipRadioProps) {
  return (
    <label className="has-checked:border-brand-700 has-checked:bg-brand-100 has-checked:text-brand-900 has-focus-visible:outline-brand-700 text-body-m has-checked:hover:bg-brand-100 flex h-8 cursor-pointer items-center rounded-full border border-neutral-200 bg-white px-3 text-neutral-800 hover:bg-neutral-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2">
      <input type="radio" className="sr-only" {...rest} />
      {label}
    </label>
  );
}

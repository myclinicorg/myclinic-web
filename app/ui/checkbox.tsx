import { RiCheckLine } from '@remixicon/react';

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label: string;
}

export default function Checkbox({ label, ...rest }: CheckboxProps) {
  return (
    <label className="text-body-s flex cursor-pointer items-center gap-2 text-neutral-800">
      <span className="relative flex size-5 shrink-0">
        <input
          type="checkbox"
          className="peer checked:border-brand-700 checked:bg-brand-700 focus-visible:outline-brand-700 size-5 cursor-pointer appearance-none border-[1.5px] border-neutral-700 bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
          {...rest}
        />
        <RiCheckLine
          aria-hidden
          className="pointer-events-none absolute inset-0 m-auto hidden size-4 text-white peer-checked:block"
        />
      </span>
      {label}
    </label>
  );
}

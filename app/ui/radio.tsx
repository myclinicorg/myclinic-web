export default function Radio({
  label,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: React.ReactNode;
}) {
  return (
    <label className="text-body-m flex cursor-pointer items-center gap-3 text-neutral-800">
      <span className="relative flex">
        <input
          type="radio"
          className="peer checked:border-brand-700 focus-visible:outline-brand-700 size-5 cursor-pointer appearance-none rounded-full border-[1.5px] border-neutral-700 bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
          {...props}
        />
        <span
          aria-hidden
          className="bg-brand-700 pointer-events-none absolute inset-0 m-auto hidden size-2.5 rounded-full peer-checked:block"
        />
      </span>
      {label}
    </label>
  );
}

import clsx from 'clsx';

function initials(name: string) {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.at(-1);
  return `${first[0]}${last?.[0] ?? ''}`.toUpperCase();
}

export default function Avatar({
  name,
  size = 's',
}: {
  name: string;
  size?: 's' | 'm' | 'l';
}) {
  return (
    <span
      aria-hidden
      className={clsx(
        'bg-brand-100 text-brand-900 flex shrink-0 items-center justify-center rounded-full',
        {
          s: 'text-body-xs size-8',
          m: 'text-body-s size-10',
          l: 'text-heading-6 size-16',
        }[size],
      )}
    >
      {initials(name)}
    </span>
  );
}

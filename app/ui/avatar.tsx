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
  size?: 's' | 'm';
}) {
  return (
    <span
      aria-hidden
      className={clsx(
        'bg-brand-100 text-brand-900 flex shrink-0 items-center justify-center rounded-full',
        size === 's' ? 'text-body-xs size-8' : 'text-body-s size-10',
      )}
    >
      {initials(name)}
    </span>
  );
}

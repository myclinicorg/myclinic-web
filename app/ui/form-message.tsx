import clsx from 'clsx';

export default function FormMessage({
  children,
  tone = 'error',
}: {
  children?: React.ReactNode;
  tone?: 'error' | 'success';
}) {
  if (!children) return null;
  return (
    <p
      aria-live="polite"
      className={clsx(
        'text-body-s',
        tone === 'error' ? 'text-error-solid' : 'text-success-text',
      )}
    >
      {children}
    </p>
  );
}

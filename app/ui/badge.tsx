import clsx from 'clsx';

type BadgeColor = 'brand' | 'gray' | 'success' | 'danger' | 'warning';
type BadgeVariant = 'solid' | 'light' | 'outline';

const variants: Record<BadgeVariant, Record<BadgeColor, string>> = {
  solid: {
    brand: 'bg-brand-700 text-white',
    gray: 'bg-neutral-700 text-white',
    success: 'bg-success-solid text-white',
    danger: 'bg-error-solid text-white',
    warning: 'bg-warning-solid text-neutral-900',
  },
  light: {
    brand: 'bg-brand-100 text-brand-900',
    gray: 'bg-neutral-100 text-neutral-800',
    success: 'bg-success-light text-success-text',
    danger: 'bg-error-light text-error-solid',
    warning: 'bg-warning-light text-warning-text',
  },
  outline: {
    brand: 'border border-neutral-200 bg-white text-neutral-800',
    gray: 'border border-neutral-200 bg-white text-neutral-800',
    success: 'border border-neutral-200 bg-white text-neutral-800',
    danger: 'border border-neutral-200 bg-white text-neutral-800',
    warning: 'border border-neutral-200 bg-white text-neutral-800',
  },
};

const dots: Record<BadgeVariant, Record<BadgeColor, string>> = {
  solid: {
    brand: 'bg-white',
    gray: 'bg-white',
    success: 'bg-white',
    danger: 'bg-white',
    warning: 'bg-white',
  },
  light: {
    brand: 'bg-brand-700',
    gray: 'bg-neutral-500',
    success: 'bg-success-solid',
    danger: 'bg-error-solid',
    warning: 'bg-warning-solid',
  },
  outline: {
    brand: 'bg-brand-700',
    gray: 'bg-neutral-500',
    success: 'bg-success-solid',
    danger: 'bg-error-solid',
    warning: 'bg-warning-solid',
  },
};

export function Badge({
  children,
  color = 'gray',
  variant = 'light',
  size = 'm',
  dot = false,
}: {
  children: React.ReactNode;
  color?: BadgeColor;
  variant?: BadgeVariant;
  size?: 's' | 'm';
  dot?: boolean;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full whitespace-nowrap',
        size === 'm'
          ? 'text-body-s h-6 gap-1.5 px-2.5'
          : 'text-body-xs h-5 gap-1 px-2',
        variants[variant][color],
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={clsx(
            'shrink-0 rounded-full',
            size === 'm' ? 'size-2' : 'size-1.5',
            dots[variant][color],
          )}
        />
      )}
      {children}
    </span>
  );
}

import clsx from 'clsx';

type Hierarchy = 'primary' | 'secondary' | 'tertiary';
type Color = 'brand' | 'gray' | 'danger';
type Size = 's' | 'm' | 'l';

export type ButtonVariants = {
  hierarchy?: Hierarchy;
  color?: Color;
  size?: Size;
  iconOnly?: boolean;
};

const sizes: Record<Size, string> = {
  s: 'h-10 text-button-s [&_svg]:size-5',
  m: 'h-12 text-button-m [&_svg]:size-6',
  l: 'h-14 text-button-l [&_svg]:size-6',
};

const paddings: Record<Size, string> = {
  s: 'px-4',
  m: 'px-4',
  l: 'px-5',
};

const iconOnlyWidths: Record<Size, string> = {
  s: 'w-10',
  m: 'w-12',
  l: 'w-14',
};

const colors: Record<Hierarchy, Record<Color, string>> = {
  primary: {
    brand: 'bg-brand-700 text-white hover:bg-brand-800',
    gray: 'bg-neutral-700 text-white hover:bg-neutral-800',
    danger: 'bg-error-solid text-white hover:brightness-90',
  },
  secondary: {
    brand: 'border-2 border-brand-700 text-brand-700 hover:bg-brand-50',
    gray: 'border-2 border-neutral-200 text-neutral-900 hover:bg-neutral-50',
    danger: 'border-2 border-error-solid text-error-solid hover:bg-error-soft',
  },
  tertiary: {
    brand: 'text-brand-700 hover:bg-brand-50',
    gray: 'text-neutral-700 hover:bg-neutral-50',
    danger: 'text-error-solid hover:bg-error-soft',
  },
};

const disabled: Record<Hierarchy, string> = {
  primary:
    'disabled:bg-neutral-200 disabled:text-white aria-disabled:bg-neutral-200 aria-disabled:text-white',
  secondary:
    'disabled:border-neutral-200 disabled:text-neutral-400 aria-disabled:border-neutral-200 aria-disabled:text-neutral-400',
  tertiary: 'disabled:text-neutral-400 aria-disabled:text-neutral-400',
};

export function buttonClasses({
  hierarchy = 'primary',
  color = 'brand',
  size = 'm',
  iconOnly = false,
}: ButtonVariants = {}) {
  return clsx(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:pointer-events-none aria-disabled:pointer-events-none',
    sizes[size],
    iconOnly ? iconOnlyWidths[size] : paddings[size],
    colors[hierarchy][color],
    disabled[hierarchy],
  );
}

interface ButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    ButtonVariants {
  children: React.ReactNode;
}

export function Button({
  children,
  className,
  hierarchy,
  color,
  size,
  iconOnly,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      className={clsx(
        buttonClasses({ hierarchy, color, size, iconOnly }),
        className,
      )}
    >
      {children}
    </button>
  );
}

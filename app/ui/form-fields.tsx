import { RiArrowDownSLine } from '@remixicon/react';
import clsx from 'clsx';

type FieldSize = 'm' | 'l';

type FieldProps = {
  id: string;
  label?: string;
  helperText?: string;
  errors?: string[];
  fieldSize?: FieldSize;
};

const boxSizes: Record<FieldSize, string> = {
  m: 'h-10 text-body-s',
  l: 'h-12 text-body-m',
};

function boxClasses(hasError: boolean, disabled?: boolean) {
  return clsx(
    'flex w-full items-center gap-2 border border-neutral-200 bg-white px-3 text-neutral-900 [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-neutral-600',
    hasError
      ? 'outline-2 -outline-offset-2 outline-error-solid'
      : 'focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-brand-700',
    disabled && 'border-neutral-100 text-neutral-400 [&_svg]:text-neutral-400',
  );
}

const controlClasses =
  'min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed';

function FieldShell({
  id,
  label,
  helperText,
  errors,
  children,
}: FieldProps & { children: React.ReactNode }) {
  const hasError = Boolean(errors?.length);
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-body-s text-neutral-800">
          {label}
        </label>
      )}
      {children}
      {hasError ? (
        <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
          {errors!.map((error) => (
            <p key={error} className="text-body-xs text-error-solid">
              {error}
            </p>
          ))}
        </div>
      ) : (
        helperText && (
          <p id={`${id}-helper`} className="text-body-xs text-neutral-600">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id: string, errors?: string[], helperText?: string) {
  if (errors?.length) return `${id}-error`;
  if (helperText) return `${id}-helper`;
  return undefined;
}

interface TextFieldProps
  extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function TextField({
  id,
  label,
  helperText,
  errors,
  fieldSize = 'm',
  iconLeft,
  iconRight,
  className,
  ...rest
}: TextFieldProps) {
  const hasError = Boolean(errors?.length);
  return (
    <FieldShell id={id} label={label} helperText={helperText} errors={errors}>
      <div
        className={clsx(
          boxClasses(hasError, rest.disabled),
          boxSizes[fieldSize],
          className,
        )}
      >
        {iconLeft}
        <input
          id={id}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy(id, errors, helperText)}
          className={controlClasses}
          {...rest}
        />
        {iconRight}
      </div>
    </FieldShell>
  );
}

interface TextareaFieldProps
  extends
    FieldProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {}

export function TextareaField({
  id,
  label,
  helperText,
  errors,
  fieldSize = 'm',
  className,
  rows = 4,
  ...rest
}: TextareaFieldProps) {
  const hasError = Boolean(errors?.length);
  return (
    <FieldShell id={id} label={label} helperText={helperText} errors={errors}>
      <div
        className={clsx(
          boxClasses(hasError, rest.disabled),
          fieldSize === 'm' ? 'text-body-s' : 'text-body-m',
          'items-start py-2',
          className,
        )}
      >
        <textarea
          id={id}
          rows={rows}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy(id, errors, helperText)}
          className={clsx(controlClasses, 'resize-y')}
          {...rest}
        />
      </div>
    </FieldShell>
  );
}

interface SelectFieldProps
  extends
    FieldProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  placeholder?: string;
}

export function SelectField({
  id,
  label,
  helperText,
  errors,
  fieldSize = 'm',
  placeholder,
  className,
  children,
  ...rest
}: SelectFieldProps) {
  const hasError = Boolean(errors?.length);
  return (
    <FieldShell id={id} label={label} helperText={helperText} errors={errors}>
      <div
        className={clsx(
          boxClasses(hasError, rest.disabled),
          boxSizes[fieldSize],
          'relative',
          className,
        )}
      >
        <select
          id={id}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy(id, errors, helperText)}
          className={clsx(
            controlClasses,
            'h-full cursor-pointer appearance-none pr-6 invalid:text-neutral-500',
          )}
          required={rest.required ?? Boolean(placeholder)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <RiArrowDownSLine
          aria-hidden
          className="pointer-events-none absolute right-3"
        />
      </div>
    </FieldShell>
  );
}

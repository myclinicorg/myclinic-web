import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiErrorWarningLine,
  RiInformationLine,
} from '@remixicon/react';
import clsx from 'clsx';

type AlertType = 'info' | 'success' | 'warning' | 'error';

const styles: Record<AlertType, { box: string; icon: string }> = {
  info: { box: 'border-brand-700 bg-brand-50', icon: 'text-brand-700' },
  success: {
    box: 'border-success-solid bg-success-soft',
    icon: 'text-success-text',
  },
  warning: {
    box: 'border-warning-solid bg-warning-soft',
    icon: 'text-warning-text',
  },
  error: { box: 'border-error-solid bg-error-soft', icon: 'text-error-solid' },
};

const icons = {
  info: RiInformationLine,
  success: RiCheckboxCircleLine,
  warning: RiErrorWarningLine,
  error: RiCloseCircleLine,
};

export default function Alert({
  type = 'info',
  title,
  children,
  actions,
}: {
  type?: AlertType;
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const Icon = icons[type];
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={clsx(
        'flex items-start gap-3 border-l-4 py-4 pr-4 pl-5',
        styles[type].box,
      )}
    >
      <Icon
        aria-hidden
        className={clsx('size-5 shrink-0', styles[type].icon)}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-subtitle-s text-neutral-900">{title}</p>
        {children && (
          <div className="text-body-s text-neutral-800">{children}</div>
        )}
        {actions && (
          <div className="text-body-s flex flex-wrap gap-4 pt-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

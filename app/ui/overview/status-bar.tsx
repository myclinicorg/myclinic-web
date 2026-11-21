import clsx from 'clsx';
import {
  APPOINTMENT_STATUS,
  type AppointmentStatus,
} from '@/app/lib/definitions';

const PART_COLORS: Record<AppointmentStatus, { fill: string; text: string }> = {
  SCHEDULED: { fill: 'bg-brand-700', text: 'text-white' },
  CONFIRMED: { fill: 'bg-warning-solid', text: 'text-neutral-900' },
  COMPLETED: { fill: 'bg-success-solid', text: 'text-white' },
  NO_SHOW: { fill: 'bg-error-solid', text: 'text-white' },
  CANCELED: { fill: 'bg-neutral-500', text: 'text-white' },
};

const MIN_LABEL_SHARE = 0.12;

export default function StatusBar({
  counts,
}: {
  counts: { status: AppointmentStatus; count: number }[];
}) {
  const total = counts.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) {
    return (
      <p className="text-body-s text-neutral-600">
        Nenhum atendimento neste mês ainda.
      </p>
    );
  }
  const parts = counts.filter((item) => item.count > 0);
  const share = (count: number) => Math.round((count / total) * 100);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-heading-3 text-neutral-900">
        {total}{' '}
        <span className="text-body-s text-neutral-600">
          atendimento{total === 1 ? '' : 's'}
        </span>
      </p>
      <div
        role="img"
        aria-label={parts
          .map(
            (item) =>
              `${APPOINTMENT_STATUS[item.status].label}: ${item.count} (${share(item.count)}%)`,
          )
          .join(', ')}
        className="flex h-7 gap-0.5"
      >
        {parts.map((item) => (
          <span
            key={item.status}
            title={`${APPOINTMENT_STATUS[item.status].label}: ${item.count} (${share(item.count)}%)`}
            className={clsx(
              'text-body-xs flex items-center rounded px-2',
              PART_COLORS[item.status].fill,
              PART_COLORS[item.status].text,
            )}
            style={{ flexGrow: item.count, flexBasis: 0 }}
          >
            {item.count / total >= MIN_LABEL_SHARE && `${share(item.count)}%`}
          </span>
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {parts.map((item) => (
          <li
            key={item.status}
            className="text-body-s flex items-center gap-2 text-neutral-800"
          >
            <span
              aria-hidden
              className={clsx(
                'size-2.5 rounded-sm',
                PART_COLORS[item.status].fill,
              )}
            />
            <span className="flex-1">
              {APPOINTMENT_STATUS[item.status].label}
            </span>
            <span className="text-subtitle-s text-neutral-900 tabular-nums">
              {item.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { RiArrowRightLine } from '@remixicon/react';
import clsx from 'clsx';
import Link from 'next/link';
import { type ToggleEvent, useId, useRef, useState } from 'react';
import {
  APPOINTMENT_STATUS,
  type Appointment,
  type AppointmentStatus,
} from '@/app/lib/definitions';
import { localDay, longDate, timeRange } from '@/app/lib/schedule';
import { formatCurrency } from '@/app/lib/utils';
import { Badge } from '@/app/ui/badge';

const EVENT_COLORS: Record<AppointmentStatus, string> = {
  SCHEDULED: 'border-brand-700 bg-brand-50',
  CONFIRMED: 'border-warning-solid bg-warning-soft',
  COMPLETED: 'border-success-solid bg-success-soft',
  NO_SHOW: 'border-error-solid bg-error-soft',
  CANCELED: 'border-neutral-500 bg-neutral-50',
};

const POPOVER_WIDTH = 280;
const ARROW_SIZE = 8;
const EDGE = 8;

type Placement = { arrow: 'top' | 'bottom'; arrowLeft: number };

export default function CalendarEvent({
  appointment,
  compact = false,
  className,
  style,
}: {
  appointment: Appointment;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const id = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement>({
    arrow: 'top',
    arrowLeft: POPOVER_WIDTH / 2,
  });
  const time = timeRange(appointment.startsAt, appointment.endsAt);
  const status = APPOINTMENT_STATUS[appointment.status];

  function close() {
    popoverRef.current?.hidePopover();
  }

  function handleToggle(event: ToggleEvent<HTMLDivElement>) {
    if (event.newState !== 'open') {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      return;
    }
    const popover = event.currentTarget;
    const trigger = triggerRef.current!.getBoundingClientRect();
    const height = popover.offsetHeight;
    const below = trigger.bottom + ARROW_SIZE + height <= window.innerHeight;
    const center = trigger.left + trigger.width / 2;
    const left = Math.min(
      Math.max(EDGE, center - POPOVER_WIDTH / 2),
      window.innerWidth - POPOVER_WIDTH - EDGE,
    );
    popover.style.top = `${below ? trigger.bottom + ARROW_SIZE : trigger.top - ARROW_SIZE - height}px`;
    popover.style.left = `${left}px`;
    setPlacement({
      arrow: below ? 'top' : 'bottom',
      arrowLeft: Math.min(Math.max(16, center - left), POPOVER_WIDTH - 16),
    });
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={id}
        aria-haspopup="dialog"
        style={style}
        className={clsx(
          'focus-visible:outline-brand-700 flex min-w-0 cursor-pointer flex-col gap-0.5 overflow-hidden border-l-3 py-1.5 pr-2 pl-2.5 text-left hover:brightness-95 focus-visible:outline-2',
          EVENT_COLORS[appointment.status],
          appointment.status === 'CANCELED' && 'opacity-70',
          className,
        )}
      >
        <span
          className={clsx(
            'text-subtitle-s truncate text-neutral-900',
            appointment.status === 'CANCELED' && 'line-through',
          )}
        >
          {compact && (
            <span className="font-normal text-neutral-600">
              {time.slice(0, 5)}{' '}
            </span>
          )}
          {appointment.patient.fullName}
        </span>
        {!compact && (
          <span className="text-body-xxs truncate text-neutral-600">
            {time} · {appointment.service.name}
          </span>
        )}
        <span className="sr-only">{status.label}</span>
      </button>
      <div
        ref={popoverRef}
        id={id}
        popover="auto"
        role="dialog"
        aria-labelledby={titleId}
        onToggle={handleToggle}
        className="inset-auto m-0 w-70 overflow-visible bg-transparent p-0 drop-shadow-[2px_4px_10px_rgb(0_0_0/0.1)]"
      >
        <div className="flex flex-col gap-2 bg-white p-4">
          <div className="flex items-start gap-2">
            <p
              id={titleId}
              className="text-subtitle-m min-w-0 flex-1 text-neutral-900"
            >
              {appointment.patient.fullName}
            </p>
            <Badge color={status.color} size="s" dot>
              {status.label}
            </Badge>
          </div>
          <p className="text-body-s text-neutral-600">
            {appointment.service.name} ·{' '}
            {formatCurrency(appointment.priceCents)}
            <br />
            {longDate(localDay(appointment.startsAt))}, {time}
          </p>
          <Link
            href={`/painel/agenda/${appointment.id}`}
            className="text-body-s text-brand-700 focus-visible:outline-brand-700 flex items-center gap-1 self-start hover:underline focus-visible:outline-2"
          >
            Ver atendimento
            <RiArrowRightLine aria-hidden className="size-4" />
          </Link>
        </div>
        <span
          aria-hidden
          style={{ left: placement.arrowLeft - ARROW_SIZE }}
          className={clsx(
            'absolute size-0 border-x-8 border-x-transparent',
            placement.arrow === 'top'
              ? '-top-2 border-b-8 border-b-white'
              : '-bottom-2 border-t-8 border-t-white',
          )}
        />
      </div>
    </>
  );
}

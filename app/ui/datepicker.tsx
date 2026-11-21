'use client';

import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import clsx from 'clsx';
import {
  addMonths,
  dayNumber,
  longDate,
  monthWeeks,
  periodTitle,
  startOfMonth,
  WEEKDAY_SHORT,
  weekday,
} from '@/app/lib/schedule';

const navClasses =
  'focus-visible:outline-brand-700 flex size-10 items-center justify-center text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 disabled:text-neutral-400 disabled:hover:bg-transparent';

export default function Datepicker({
  month,
  onMonthChange,
  selected,
  onSelect,
  today,
  minMonth,
  maxMonth,
  isDisabled,
}: {
  month: string;
  onMonthChange: (month: string) => void;
  selected?: string;
  onSelect: (day: string) => void;
  today: string;
  minMonth: string;
  maxMonth: string;
  isDisabled: (day: string) => boolean;
}) {
  const weeks = monthWeeks(month);
  const current = month.slice(0, 7);

  return (
    <div className="flex w-fit flex-col gap-2 border border-neutral-100 bg-white p-4">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, -1))}
          disabled={startOfMonth(month) <= minMonth}
          aria-label="Mês anterior"
          className={navClasses}
        >
          <RiArrowLeftSLine aria-hidden className="size-5" />
        </button>
        <p
          aria-live="polite"
          className="text-subtitle-m flex-1 text-center text-neutral-900"
        >
          {periodTitle('mes', month)}
        </p>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, 1))}
          disabled={startOfMonth(month) >= maxMonth}
          aria-label="Próximo mês"
          className={navClasses}
        >
          <RiArrowRightSLine aria-hidden className="size-5" />
        </button>
      </div>
      <div role="grid" aria-label={periodTitle('mes', month)}>
        <div role="row" className="flex">
          {weeks[0].map((day) => (
            <span
              key={day}
              role="columnheader"
              className="text-body-xs flex h-8 w-10 items-center justify-center text-neutral-600"
            >
              {WEEKDAY_SHORT[weekday(day)]}
            </span>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0]} role="row" className="flex">
            {week.map((day) => {
              if (day.slice(0, 7) !== current) {
                return <span key={day} role="gridcell" className="size-10" />;
              }
              const disabled = isDisabled(day);
              const isSelected = day === selected;
              return (
                <span key={day} role="gridcell">
                  <button
                    type="button"
                    onClick={() => onSelect(day)}
                    disabled={disabled}
                    aria-pressed={isSelected}
                    aria-label={longDate(day)}
                    className={clsx(
                      'focus-visible:outline-brand-700 flex size-10 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-1',
                      isSelected
                        ? 'bg-brand-700 text-subtitle-s text-white'
                        : disabled
                          ? 'text-body-s text-neutral-400'
                          : 'text-body-s text-neutral-800 hover:bg-neutral-50',
                      day === today &&
                        !isSelected &&
                        'border-brand-700 text-subtitle-s text-brand-700 border',
                    )}
                  >
                    {dayNumber(day)}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

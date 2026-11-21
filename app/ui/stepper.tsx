import { RiCheckLine, RiErrorWarningLine } from '@remixicon/react';
import clsx from 'clsx';

export type Step = { title: string; description: string; error?: boolean };

export default function Stepper({
  steps,
  current,
  label,
}: {
  steps: Step[];
  current: number;
  label: string;
}) {
  return (
    <ol aria-label={label} className="flex flex-col">
      {steps.map((step, index) => {
        const state = step.error
          ? 'error'
          : index < current
            ? 'completed'
            : index === current
              ? 'current'
              : 'default';
        return (
          <li
            key={step.title}
            aria-current={index === current ? 'step' : undefined}
            className="flex items-start gap-3 pb-6 last:pb-0"
          >
            <span
              className={clsx(
                'text-subtitle-s flex size-7 shrink-0 items-center justify-center rounded-full',
                {
                  'bg-error-light text-error-solid': state === 'error',
                  'bg-brand-700 text-white': state === 'completed',
                  'bg-brand-100 text-brand-900': state === 'current',
                  'bg-neutral-100 text-neutral-600': state === 'default',
                },
              )}
            >
              {state === 'error' ? (
                <RiErrorWarningLine aria-hidden className="size-4" />
              ) : state === 'completed' ? (
                <RiCheckLine aria-hidden className="size-4" />
              ) : (
                index + 1
              )}
            </span>
            <span className="flex flex-col gap-0.5">
              <span
                className={clsx(
                  'text-subtitle-s',
                  state === 'default' ? 'text-neutral-600' : 'text-neutral-900',
                )}
              >
                {step.title}
              </span>
              <span
                className={clsx(
                  'text-body-xs',
                  state === 'error' ? 'text-error-solid' : 'text-neutral-600',
                )}
              >
                {state === 'error' ? 'Precisa de atenção' : step.description}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

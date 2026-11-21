import { RiErrorWarningLine } from '@remixicon/react';
import clsx from 'clsx';
import Link from 'next/link';

function tabClasses(active: boolean) {
  return clsx(
    'text-button-m -mb-px flex items-center gap-2 border-b-2 px-1 py-3',
    active
      ? 'border-brand-700 text-brand-700'
      : 'border-transparent text-neutral-800 hover:text-neutral-900',
  );
}

export function TabButtons({
  label,
  idPrefix,
  tabs,
  current,
  onChange,
}: {
  label: string;
  idPrefix: string;
  tabs: { name: string; error?: boolean }[];
  current: number;
  onChange: (index: number) => void;
}) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const next = {
      ArrowRight: (current + 1) % tabs.length,
      ArrowLeft: (current - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onChange(next);
    document.getElementById(`${idPrefix}-tab-${next}`)?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="flex gap-6 border-b border-neutral-100"
    >
      {tabs.map((tab, index) => {
        const active = index === current;
        return (
          <button
            key={tab.name}
            id={`${idPrefix}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${index}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(index)}
            className={clsx(tabClasses(active), 'shrink-0')}
          >
            {tab.name}
            {tab.error && (
              <RiErrorWarningLine
                aria-label="Há erros nesta aba"
                className="text-error-solid size-5"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function Tabs({
  label,
  tabs,
  current,
}: {
  label: string;
  tabs: { name: string; href: string; value: string; count?: number }[];
  current: string;
}) {
  return (
    <nav aria-label={label} className="flex gap-6 border-b border-neutral-100">
      {tabs.map((tab) => {
        const active = tab.value === current;
        return (
          <Link
            key={tab.value}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={tabClasses(active)}
          >
            {tab.name}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'text-body-xs flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-normal tracking-normal text-white',
                  active ? 'bg-brand-700' : 'bg-neutral-700',
                )}
              >
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

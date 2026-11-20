'use client';

import { RiCloseLine } from '@remixicon/react';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

const widths = {
  s: 'w-100',
  m: 'w-140',
  l: 'w-200',
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 's',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: keyof typeof widths;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="modal-title"
      className={clsx(
        'shadow-card m-auto max-w-[calc(100%-2rem)] bg-white p-0 text-neutral-800 backdrop:bg-neutral-900/50',
        widths[size],
      )}
    >
      <div className="flex items-center gap-4 pt-5 pr-4 pb-3 pl-6">
        <h2 id="modal-title" className="text-heading-5 flex-1 text-neutral-900">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="focus-visible:outline-brand-700 flex p-2 text-neutral-700 hover:bg-neutral-50 focus-visible:outline-2"
        >
          <RiCloseLine aria-hidden className="size-6" />
        </button>
      </div>
      <div className="text-body-m flex flex-col gap-3 px-6 pb-6">
        {children}
      </div>
      {footer && (
        <div className="flex items-center justify-end gap-3 bg-neutral-50 px-6 py-4">
          {footer}
        </div>
      )}
    </dialog>
  );
}

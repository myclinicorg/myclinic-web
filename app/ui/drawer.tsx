'use client';

import { RiCloseLine } from '@remixicon/react';
import { useEffect, useId, useRef } from 'react';

export default function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby={titleId}
      className="shadow-card my-0 mr-0 ml-auto h-dvh max-h-none w-100 max-w-full border-l border-neutral-100 bg-white p-0 text-neutral-800 backdrop:bg-neutral-900/50"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-4 border-b border-neutral-100 py-4 pr-4 pl-6">
          <h2 id={titleId} className="text-heading-5 flex-1 text-neutral-900">
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
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          {children}
        </div>
        {footer && (
          <div className="flex items-center gap-3 border-t border-neutral-100 px-6 py-4 [&>*]:flex-1">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}

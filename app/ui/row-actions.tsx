'use client';

import {
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiEyeLine,
  RiMoreLine,
  type RemixiconComponentType,
} from '@remixicon/react';
import Link from 'next/link';
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ToggleEvent,
} from 'react';
import type { DeleteState } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import FormMessage from '@/app/ui/form-message';
import { Modal } from '@/app/ui/modal';
import { FLASH_EVENT } from '@/app/ui/toast';

type DeleteAction = () => Promise<DeleteState>;

type Item =
  | { label: string; icon: RemixiconComponentType; href: string }
  | { label: string; icon: RemixiconComponentType; onSelect: () => void };

const MENU_WIDTH = 240;
const MENU_GAP = 4;

const triggerClasses =
  'focus-visible:outline-brand-700 flex size-10 shrink-0 items-center justify-center text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2';
const itemClasses =
  'text-menu-m flex h-11 w-full items-center gap-3 px-3 text-left text-neutral-800 hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none';

function DeleteDialog({
  open,
  onClose,
  action,
  title,
  name,
}: {
  open: boolean;
  onClose: () => void;
  action: DeleteAction;
  title: string;
  name: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && !state?.message) {
      window.dispatchEvent(new Event(FLASH_EVENT));
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button hierarchy="secondary" color="gray" onClick={onClose}>
            Cancelar
          </Button>
          <form action={formAction}>
            <Button type="submit" color="danger" disabled={isPending}>
              Excluir
            </Button>
          </form>
        </>
      }
    >
      <p>
        Excluir <strong className="font-medium">{name}</strong>? Esta ação não
        pode ser desfeita.
      </p>
      <FormMessage>{state?.message}</FormMessage>
    </Modal>
  );
}

export function DeleteButton({
  action,
  title,
  name,
}: {
  action: DeleteAction;
  title: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button hierarchy="tertiary" color="danger" onClick={() => setOpen(true)}>
        <RiDeleteBinLine aria-hidden />
        Excluir
      </Button>
      <DeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        action={action}
        title={title}
        name={name}
      />
    </>
  );
}

function MenuItems({ items, onDone }: { items: Item[]; onDone: () => void }) {
  return items.map(({ label, icon: Icon, ...item }) =>
    'href' in item ? (
      <Link
        key={label}
        href={item.href}
        role="menuitem"
        onClick={onDone}
        className={itemClasses}
      >
        <Icon aria-hidden className="size-5 shrink-0" />
        {label}
      </Link>
    ) : (
      <button
        key={label}
        type="button"
        role="menuitem"
        onClick={() => {
          onDone();
          item.onSelect();
        }}
        className={itemClasses}
      >
        <Icon aria-hidden className="size-5 shrink-0" />
        {label}
      </button>
    ),
  );
}

function moveFocus(event: KeyboardEvent<HTMLElement>) {
  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  );
  const index = items.indexOf(document.activeElement as HTMLElement);
  const next = {
    ArrowDown: (index + 1) % items.length,
    ArrowUp: (index - 1 + items.length) % items.length,
    Home: 0,
    End: items.length - 1,
  }[event.key];
  if (next !== undefined) {
    event.preventDefault();
    items[next]?.focus();
  }
}

function ElevatedMenu({ label, items }: { label: string; items: Item[] }) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function close() {
    menuRef.current?.hidePopover();
  }

  function handleToggle(event: ToggleEvent<HTMLDivElement>) {
    if (event.newState !== 'open') {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      return;
    }
    const menu = event.currentTarget;
    const trigger = triggerRef.current!.getBoundingClientRect();
    const height = menu.offsetHeight;
    const top =
      trigger.bottom + MENU_GAP + height <= window.innerHeight
        ? trigger.bottom + MENU_GAP
        : trigger.top - MENU_GAP - height;
    menu.style.top = `${top}px`;
    menu.style.left = `${Math.max(8, trigger.right - MENU_WIDTH)}px`;
    menu.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={id}
        aria-label={label}
        aria-haspopup="menu"
        title="Mais ações"
        className={triggerClasses}
      >
        <RiMoreLine aria-hidden className="size-5" />
      </button>
      <div
        ref={menuRef}
        id={id}
        popover="auto"
        role="menu"
        aria-label={label}
        onToggle={handleToggle}
        onKeyDown={moveFocus}
        className="inset-auto m-0 w-60 border border-neutral-100 bg-white p-2 shadow-[2px_4px_10px_0_rgb(0_0_0/0.1)]"
      >
        <MenuItems
          items={items}
          onDone={() => {
            close();
            triggerRef.current?.focus();
          }}
        />
      </div>
    </>
  );
}

function BottomSheet({
  label,
  title,
  items,
}: {
  label: string;
  title: string;
  items: Item[];
}) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);

  function close() {
    ref.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={label}
        aria-haspopup="dialog"
        className={triggerClasses}
      >
        <RiMoreLine aria-hidden className="size-5" />
      </button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="shadow-card mx-0 mt-auto mb-0 w-full max-w-full bg-white p-0 text-neutral-800 backdrop:bg-neutral-900/50"
      >
        <div className="flex flex-col items-center gap-4 px-4 pt-2 pb-8">
          <span aria-hidden className="h-1 w-10 rounded-full bg-neutral-200" />
          <div className="flex w-full items-center gap-2">
            <h2
              id={titleId}
              className="text-heading-6 min-w-0 flex-1 truncate text-neutral-900"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="focus-visible:outline-brand-700 flex p-1.5 text-neutral-700 hover:bg-neutral-50 focus-visible:outline-2"
            >
              <RiCloseLine aria-hidden className="size-5" />
            </button>
          </div>
          <div
            role="menu"
            aria-labelledby={titleId}
            onKeyDown={moveFocus}
            className="flex w-full flex-col gap-1"
          >
            <MenuItems items={items} onDone={close} />
          </div>
          <Button hierarchy="secondary" onClick={close} className="w-full">
            Cancelar
          </Button>
        </div>
      </dialog>
    </>
  );
}

export type MenuItem = Item;

export function ActionMenu({
  label,
  title,
  items,
  variant,
}: {
  label: string;
  title: string;
  items: Item[];
  variant: 'menu' | 'sheet';
}) {
  return variant === 'menu' ? (
    <ElevatedMenu label={label} items={items} />
  ) : (
    <BottomSheet label={label} title={title} items={items} />
  );
}

export function RowMenu({
  name,
  viewHref,
  editHref,
  deleteAction,
  deleteTitle,
  variant,
}: {
  name: string;
  viewHref?: string;
  editHref: string;
  deleteAction: DeleteAction;
  deleteTitle: string;
  variant: 'menu' | 'sheet';
}) {
  const [confirming, setConfirming] = useState(false);
  const label = `Ações de ${name}`;
  const items: Item[] = [
    ...(viewHref
      ? [{ label: 'Ver detalhes', icon: RiEyeLine, href: viewHref }]
      : []),
    { label: 'Editar', icon: RiEditLine, href: editHref },
    {
      label: 'Excluir',
      icon: RiDeleteBinLine,
      onSelect: () => setConfirming(true),
    },
  ];

  return (
    <>
      <ActionMenu label={label} title={name} items={items} variant={variant} />
      <DeleteDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        action={deleteAction}
        title={deleteTitle}
        name={name}
      />
    </>
  );
}

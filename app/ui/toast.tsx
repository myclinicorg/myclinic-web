'use client';

import { RiCheckboxCircleLine, RiCloseLine } from '@remixicon/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FLASH_COOKIE = 'flash';
export const FLASH_EVENT = 'myclinic:flash';

function readFlash() {
  const entry = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${FLASH_COOKIE}=`));
  if (!entry) return null;
  document.cookie = `${FLASH_COOKIE}=; Max-Age=0; path=/`;
  return decodeURIComponent(entry.slice(FLASH_COOKIE.length + 1));
}

export default function Toast() {
  const pathname = usePathname();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const show = () => {
      const flash = readFlash();
      if (flash) setMessage(flash);
    };
    show();
    window.addEventListener(FLASH_EVENT, show);
    return () => window.removeEventListener(FLASH_EVENT, show);
  }, [pathname]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="text-body-s shadow-card fixed inset-x-4 bottom-24 z-50 flex items-center gap-3 bg-neutral-900 py-3 pr-2 pl-4 text-white sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-100"
    >
      <RiCheckboxCircleLine
        aria-hidden
        className="text-success-light size-5 shrink-0"
      />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={() => setMessage(null)}
        aria-label="Fechar aviso"
        className="flex size-8 items-center justify-center text-white hover:bg-white/10"
      >
        <RiCloseLine aria-hidden className="size-5" />
      </button>
    </div>
  );
}

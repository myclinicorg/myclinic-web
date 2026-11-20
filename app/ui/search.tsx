'use client';

import { RiSearchLine } from '@remixicon/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="focus-within:outline-brand-700 relative flex h-10 flex-1 shrink-0 items-center gap-2 border border-neutral-200 bg-white px-3 focus-within:outline-2 focus-within:-outline-offset-2">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      <RiSearchLine aria-hidden className="size-5 shrink-0 text-neutral-600" />
      <input
        id="search"
        className="text-body-s min-w-0 flex-1 bg-transparent text-neutral-900 outline-none placeholder:text-neutral-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}

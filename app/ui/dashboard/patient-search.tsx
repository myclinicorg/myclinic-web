'use client';

import { RiSearchLine } from '@remixicon/react';
import { useRouter } from 'next/navigation';

export default function PatientSearch() {
  const router = useRouter();

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const query = new FormData(event.currentTarget).get('query');
        const params = new URLSearchParams();
        if (typeof query === 'string' && query.trim()) {
          params.set('query', query.trim());
        }
        router.push(`/painel/pacientes?${params.toString()}`);
      }}
      className="focus-within:outline-brand-700 flex h-10 w-full items-center gap-2 border border-neutral-200 bg-white px-3 focus-within:outline-2 focus-within:-outline-offset-2"
    >
      <label htmlFor="patient-search" className="sr-only">
        Buscar pacientes
      </label>
      <RiSearchLine aria-hidden className="size-5 shrink-0 text-neutral-600" />
      <input
        id="patient-search"
        name="query"
        type="search"
        placeholder="Buscar pacientes…"
        className="text-body-s min-w-0 flex-1 bg-transparent text-neutral-900 outline-none placeholder:text-neutral-500"
      />
    </form>
  );
}

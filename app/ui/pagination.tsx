'use client';

import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/app/lib/utils';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <nav aria-label="Paginação" className="inline-flex items-center gap-1">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      {allPages.map((page, index) => (
        <PaginationNumber
          key={`${page}-${index}`}
          href={createPageURL(page)}
          page={page}
          isActive={currentPage === page}
        />
      ))}

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </nav>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
}) {
  const className = clsx(
    'flex size-10 items-center justify-center text-button-s',
    {
      'bg-brand-700 text-white': isActive,
      'text-neutral-800 hover:bg-neutral-50': !isActive && page !== '...',
      'text-neutral-600': page === '...',
    },
  );

  return isActive || page === '...' ? (
    <span className={className} aria-current={isActive ? 'page' : undefined}>
      {page === '...' ? '…' : page}
    </span>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-10 items-center gap-1 px-3 text-button-s',
    isDisabled
      ? 'pointer-events-none text-neutral-400'
      : 'text-neutral-800 hover:bg-neutral-50',
  );

  const content =
    direction === 'left' ? (
      <>
        <RiArrowLeftSLine aria-hidden className="size-5" />
        Anterior
      </>
    ) : (
      <>
        Próxima
        <RiArrowRightSLine aria-hidden className="size-5" />
      </>
    );

  return isDisabled ? (
    <span className={className} aria-disabled="true">
      {content}
    </span>
  ) : (
    <Link className={className} href={href}>
      {content}
    </Link>
  );
}

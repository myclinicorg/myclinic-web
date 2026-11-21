import { rubik } from '@/app/ui/fonts';

export function MyClinicSymbol({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <path d="M32 61C32 61 10 41 10 26A22 22 0 0 1 32 4Z" fill="#0F62FE" />
      <path d="M32 61C32 61 54 41 54 26A22 22 0 0 0 32 4Z" fill="#4589FF" />
      <path
        d="M32 39C25 34 24 30 26.5 27.5C28.5 25.5 31 26.3 32 28.2C33 26.3 35.5 25.5 37.5 27.5C40 30 39 34 32 39Z"
        fill="#FFFFFF"
        transform="translate(32 25) scale(1.25) translate(-32 -32.3)"
      />
    </svg>
  );
}

export default function MyClinicLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <MyClinicSymbol className="size-8" />
      <span
        aria-hidden
        className={`${rubik.className} text-[26px] leading-none font-bold tracking-[-0.025em]`}
      >
        <span className="text-brand-400">my</span>
        <span className="text-brand-900">clinic</span>
      </span>
      <span className="sr-only">MyClinic</span>
    </div>
  );
}

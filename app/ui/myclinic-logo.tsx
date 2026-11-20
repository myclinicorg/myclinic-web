import { RiHeartPulseLine } from '@remixicon/react';

export default function MyClinicLogo() {
  return (
    <div className="flex items-center gap-2 text-neutral-900">
      <RiHeartPulseLine aria-hidden className="text-brand-700 size-7" />
      <span className="text-heading-5">MyClinic</span>
    </div>
  );
}

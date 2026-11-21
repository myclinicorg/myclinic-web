import type { RemixiconComponentType } from '@remixicon/react';

export default function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: RemixiconComponentType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="bg-brand-100 text-brand-700 flex size-12 items-center justify-center">
        <Icon aria-hidden className="size-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-heading-6 text-neutral-900">{title}</h3>
        <p className="text-body-s text-neutral-600">{description}</p>
      </div>
    </div>
  );
}

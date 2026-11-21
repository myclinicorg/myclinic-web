import clsx from 'clsx';
import { Badge } from '@/app/ui/badge';

export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  as: Heading = 'h2',
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        'flex max-w-180 flex-col gap-4',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start',
      )}
    >
      {eyebrow && (
        <Badge color="brand" variant="light">
          {eyebrow}
        </Badge>
      )}
      <Heading
        id={id}
        className={clsx(
          'text-neutral-900',
          Heading === 'h1'
            ? 'text-heading-3 md:text-heading-1'
            : 'text-heading-3 md:text-heading-2',
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="text-body-m md:text-body-l text-neutral-600">
          {description}
        </p>
      )}
      {children && (
        <div className="flex flex-wrap justify-center gap-3">{children}</div>
      )}
    </div>
  );
}

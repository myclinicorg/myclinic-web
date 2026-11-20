'use client';

import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { useState } from 'react';
import { TextField } from '@/app/ui/form-fields';

export default function PasswordField(
  props: Omit<React.ComponentProps<typeof TextField>, 'type' | 'iconRight'>,
) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      iconRight={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
          className="focus-visible:outline-brand-700 flex shrink-0 text-neutral-600 focus-visible:outline-2"
        >
          {visible ? (
            <RiEyeOffLine aria-hidden className="size-5" />
          ) : (
            <RiEyeLine aria-hidden className="size-5" />
          )}
        </button>
      }
    />
  );
}

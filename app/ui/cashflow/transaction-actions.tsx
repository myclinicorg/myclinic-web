'use client';

import { RiCheckLine, RiCloseCircleLine, RiEditLine } from '@remixicon/react';
import { useActionState, useState } from 'react';
import { cancelTransaction, payTransaction } from '@/app/lib/actions';
import type { DeleteState } from '@/app/lib/actions';
import { PAYMENT_METHODS, type TransactionStatus } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import { SelectField } from '@/app/ui/form-fields';
import FormMessage from '@/app/ui/form-message';
import { Modal } from '@/app/ui/modal';
import { ActionMenu, type MenuItem } from '@/app/ui/row-actions';
import { FLASH_EVENT } from '@/app/ui/toast';

export default function TransactionActions({
  id,
  name,
  amount,
  status,
  variant,
}: {
  id: string;
  name: string;
  amount: string;
  status: TransactionStatus;
  variant: 'menu' | 'sheet';
}) {
  const [dialog, setDialog] = useState<'pay' | 'cancel'>();
  const close = () => setDialog(undefined);

  function withSuccess(
    action: (state: DeleteState, formData: FormData) => Promise<DeleteState>,
  ) {
    return async (state: DeleteState, formData: FormData) => {
      const result = await action(state, formData);
      if (!result?.message) {
        close();
        window.dispatchEvent(new Event(FLASH_EVENT));
      }
      return result;
    };
  }

  const [payState, payAction, isPaying] = useActionState(
    withSuccess(payTransaction.bind(null, id)),
    undefined,
  );
  const [cancelState, cancelAction, isCanceling] = useActionState(
    withSuccess(() => cancelTransaction(id)),
    undefined,
  );

  if (status === 'CANCELED') {
    return <span className="block size-10" />;
  }

  const items: MenuItem[] = [
    ...(status === 'PENDING'
      ? [
          {
            label: 'Marcar como pago',
            icon: RiCheckLine,
            onSelect: () => setDialog('pay'),
          },
        ]
      : []),
    { label: 'Editar', icon: RiEditLine, href: `/painel/caixa/${id}/editar` },
    {
      label: 'Cancelar lançamento',
      icon: RiCloseCircleLine,
      onSelect: () => setDialog('cancel'),
    },
  ];

  return (
    <>
      <ActionMenu
        label={`Ações de ${name}`}
        title={name}
        items={items}
        variant={variant}
      />
      {dialog === 'pay' && status === 'PENDING' && (
        <Modal
          open
          onClose={close}
          title="Registrar pagamento"
          footer={
            <>
              <Button hierarchy="secondary" color="gray" onClick={close}>
                Voltar
              </Button>
              <Button type="submit" form={`pay-${id}`} disabled={isPaying}>
                Registrar pagamento
              </Button>
            </>
          }
        >
          <form
            id={`pay-${id}`}
            action={payAction}
            className="flex flex-col gap-4"
          >
            <p>
              <strong className="font-medium">{name}</strong> · {amount}
            </p>
            <SelectField
              id={`payment-method-${id}`}
              name="paymentMethod"
              label="Forma de pagamento"
              defaultValue="PIX"
            >
              {Object.entries(PAYMENT_METHODS).map(([value, method]) => (
                <option key={value} value={value}>
                  {method.label}
                </option>
              ))}
            </SelectField>
            <FormMessage>{payState?.message}</FormMessage>
          </form>
        </Modal>
      )}
      {dialog === 'cancel' && (
        <Modal
          open
          onClose={close}
          title="Cancelar lançamento"
          footer={
            <>
              <Button hierarchy="secondary" color="gray" onClick={close}>
                Voltar
              </Button>
              <form action={cancelAction}>
                <Button type="submit" color="danger" disabled={isCanceling}>
                  Cancelar lançamento
                </Button>
              </form>
            </>
          }
        >
          <p>
            Cancelar <strong className="font-medium">{name}</strong> ({amount})?
            Ele deixa de contar no caixa.
          </p>
          <FormMessage>{cancelState?.message}</FormMessage>
        </Modal>
      )}
    </>
  );
}

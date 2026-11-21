'use client';

import { RiCheckDoubleLine } from '@remixicon/react';
import { useActionState } from 'react';
import {
  type AppointmentActionState,
  completeAppointment,
} from '@/app/lib/actions';
import { type AppointmentDetail, PAYMENT_METHODS } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import { Button } from '@/app/ui/button';
import FormMessage from '@/app/ui/form-message';
import OptionCard from '@/app/ui/option-card';
import OrderSummary from '@/app/ui/order-summary';

export default function CompleteForm({
  appointment,
}: {
  appointment: AppointmentDetail;
}) {
  const [state, formAction, isPending] = useActionState<
    AppointmentActionState,
    FormData
  >(completeAppointment.bind(null, appointment.id), undefined);
  const price = formatCurrency(appointment.priceCents);

  return (
    <form
      action={formAction}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-start"
    >
      <fieldset className="flex flex-col gap-3 border border-neutral-100 bg-white p-6">
        <legend className="sr-only">Forma de pagamento</legend>
        <div className="mb-2 flex flex-col gap-1">
          <h2 className="text-heading-5 text-neutral-900">
            Como foi o pagamento?
          </h2>
          <p className="text-body-s text-neutral-600">
            O valor entra no caixa como receita do atendimento.
          </p>
        </div>
        {Object.entries(PAYMENT_METHODS).map(([value, method], index) => (
          <OptionCard
            key={value}
            name="paymentMethod"
            value={value}
            title={method.label}
            description={method.description}
            defaultChecked={index === 0}
          />
        ))}
        <OptionCard
          name="paymentMethod"
          value="LATER"
          title="Receber depois"
          description="Fica como pendente no caixa até ser pago."
        />
      </fieldset>
      <OrderSummary
        title="Resumo"
        lines={[
          { label: appointment.service.name, value: price },
          { label: 'Paciente', value: appointment.patient.fullName },
        ]}
        total={price}
      >
        <Button type="submit" size="l" disabled={isPending} className="w-full">
          <RiCheckDoubleLine aria-hidden />
          Concluir atendimento
        </Button>
        <FormMessage>{state?.message}</FormMessage>
      </OrderSummary>
    </form>
  );
}

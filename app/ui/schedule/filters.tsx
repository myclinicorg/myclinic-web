'use client';

import { RiFilter3Line } from '@remixicon/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  APPOINTMENT_STATUS,
  type AppointmentStatus,
} from '@/app/lib/definitions';
import type { CalendarView } from '@/app/lib/schedule';
import { Button } from '@/app/ui/button';
import Drawer from '@/app/ui/drawer';
import { SelectField } from '@/app/ui/form-fields';
import Radio from '@/app/ui/radio';
import { type ScheduleFilters, scheduleHref } from '@/app/ui/schedule/links';

export default function ScheduleFiltersButton({
  view,
  day,
  filters,
  patients,
  idPrefix,
}: {
  view: CalendarView;
  day: string;
  filters: ScheduleFilters;
  patients: { id: string; fullName: string }[];
  idPrefix: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>(filters.status ?? '');
  const [patientId, setPatientId] = useState(filters.patientId ?? '');
  const active = [filters.status, filters.patientId].filter(Boolean).length;

  function apply(next: ScheduleFilters) {
    setOpen(false);
    router.push(scheduleHref(view, day, next));
  }

  return (
    <>
      <Button
        hierarchy="secondary"
        color="gray"
        size="s"
        onClick={() => {
          setStatus(filters.status ?? '');
          setPatientId(filters.patientId ?? '');
          setOpen(true);
        }}
      >
        <RiFilter3Line aria-hidden />
        Filtros
        {active > 0 && (
          <span className="bg-brand-700 text-body-xs flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-normal tracking-normal text-white">
            {active}
          </span>
        )}
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filtrar agenda"
        footer={
          <>
            <Button hierarchy="secondary" onClick={() => apply({})}>
              Limpar
            </Button>
            <Button
              onClick={() =>
                apply({
                  status: (status || undefined) as
                    AppointmentStatus | undefined,
                  patientId: patientId || undefined,
                })
              }
            >
              Aplicar
            </Button>
          </>
        }
      >
        <fieldset className="flex flex-col gap-3">
          <legend className="text-subtitle-m mb-3 text-neutral-900">
            Status
          </legend>
          {[
            ['', 'Todos'],
            ...Object.entries(APPOINTMENT_STATUS).map(([value, item]) => [
              value,
              item.label,
            ]),
          ].map(([value, label]) => (
            <Radio
              key={value}
              name={`${idPrefix}-status`}
              value={value}
              label={label}
              checked={status === value}
              onChange={() => setStatus(value)}
            />
          ))}
        </fieldset>
        <SelectField
          id={`${idPrefix}-patient`}
          label="Paciente"
          value={patientId}
          onChange={(event) => setPatientId(event.target.value)}
        >
          <option value="">Todos os pacientes</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.fullName}
            </option>
          ))}
        </SelectField>
      </Drawer>
    </>
  );
}

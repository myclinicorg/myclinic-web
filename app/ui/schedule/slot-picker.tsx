'use client';

import { useState } from 'react';
import {
  availableSlots,
  type BookingRules,
  longDate,
  startOfMonth,
} from '@/app/lib/schedule';
import { ChipRadio } from '@/app/ui/chip';
import Datepicker from '@/app/ui/datepicker';

export default function SlotPicker({
  rules,
  duration,
  day,
  time,
  onDayChange,
  onTimeChange,
}: {
  rules: BookingRules;
  duration: number;
  day?: string;
  time?: string;
  onDayChange: (day: string) => void;
  onTimeChange: (time: string) => void;
}) {
  const [month, setMonth] = useState(startOfMonth(day ?? rules.today));
  const slots = day ? availableSlots(rules, day, duration) : [];

  return (
    <div className="flex flex-col gap-6 xl:flex-row">
      <Datepicker
        month={month}
        onMonthChange={setMonth}
        selected={day}
        onSelect={onDayChange}
        today={rules.today}
        minMonth={startOfMonth(rules.today)}
        maxMonth={startOfMonth(rules.lastDay)}
        isDisabled={(value) =>
          availableSlots(rules, value, duration).length === 0
        }
      />
      <fieldset className="flex min-w-0 flex-1 flex-col gap-3">
        <legend className="text-subtitle-m mb-3 text-neutral-900">
          {day ? `Horários em ${longDate(day)}` : 'Horários'}
        </legend>
        {!day ? (
          <p className="text-body-s text-neutral-600">
            Escolha um dia no calendário.
          </p>
        ) : slots.length === 0 ? (
          <p className="text-body-s text-neutral-600">
            Nenhum horário livre neste dia.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <ChipRadio
                key={slot}
                name="timeChoice"
                value={slot}
                label={slot}
                checked={slot === time}
                onChange={() => onTimeChange(slot)}
              />
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}

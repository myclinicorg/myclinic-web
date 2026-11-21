export type CalendarView = 'semana' | 'mes';

const OFFSET = '-03:00';
const DAY_MS = 24 * 60 * 60 * 1000;

export const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function toDate(day: string) {
  return new Date(`${day}T00:00:00Z`);
}

function fromDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function isValidDay(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(toDate(value).getTime())
  );
}

export function addDays(day: string, amount: number) {
  return fromDate(new Date(toDate(day).getTime() + amount * DAY_MS));
}

export function addMonths(day: string, amount: number) {
  const date = toDate(day);
  return fromDate(
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1)),
  );
}

export function weekday(day: string) {
  return toDate(day).getUTCDay();
}

export function startOfWeek(day: string) {
  return addDays(day, -((weekday(day) + 6) % 7));
}

export function startOfMonth(day: string) {
  return `${day.slice(0, 8)}01`;
}

export function dayNumber(day: string) {
  return Number(day.slice(8, 10));
}

export function weekDays(day: string) {
  const monday = startOfWeek(day);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function monthWeeks(day: string) {
  const first = startOfMonth(day);
  const next = addMonths(first, 1);
  const weeks: string[][] = [];
  for (
    let monday = startOfWeek(first);
    monday < next;
    monday = addDays(monday, 7)
  ) {
    weeks.push(weekDays(monday));
  }
  return weeks;
}

export function rangeFor(view: CalendarView, day: string) {
  const days = view === 'semana' ? weekDays(day) : monthWeeks(day).flat();
  return {
    first: days[0],
    last: days[days.length - 1],
    from: `${days[0]}T00:00:00${OFFSET}`,
    to: `${addDays(days[days.length - 1], 1)}T00:00:00${OFFSET}`,
  };
}

export function shiftPeriod(view: CalendarView, day: string, amount: number) {
  return view === 'semana' ? addDays(day, amount * 7) : addMonths(day, amount);
}

export function periodTitle(view: CalendarView, day: string) {
  const [year, month] = day.split('-').map(Number);
  if (view === 'mes') {
    return `${MONTHS[month - 1][0].toUpperCase()}${MONTHS[month - 1].slice(1)} de ${year}`;
  }
  const days = weekDays(day);
  const first = days[0];
  const last = days[6];
  const short = (value: string) =>
    MONTHS[Number(value.slice(5, 7)) - 1].slice(0, 3);
  return first.slice(5, 7) === last.slice(5, 7)
    ? `${dayNumber(first)} – ${dayNumber(last)} de ${short(last)}. de ${last.slice(0, 4)}`
    : `${dayNumber(first)} de ${short(first)}. – ${dayNumber(last)} de ${short(last)}. de ${last.slice(0, 4)}`;
}

export function longDate(day: string) {
  const [year, month, date] = day.split('-').map(Number);
  return `${WEEKDAY_SHORT[weekday(day)]}, ${date} de ${MONTHS[month - 1]} de ${year}`;
}

export function localDay(iso: string) {
  return fromDate(new Date(new Date(iso).getTime() - 3 * 60 * 60 * 1000));
}

export function localMinutes(iso: string) {
  const date = new Date(new Date(iso).getTime() - 3 * 60 * 60 * 1000);
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

export function formatMinutes(minutes: number) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`;
}

export function timeRange(startsAt: string, endsAt: string) {
  return `${formatMinutes(localMinutes(startsAt))} – ${formatMinutes(localMinutes(endsAt))}`;
}

export function parseTime(value: string | null | undefined) {
  if (!value) return undefined;
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function layoutLanes<T extends { start: number; end: number }>(
  items: T[],
) {
  const sorted = items.toSorted((a, b) => a.start - b.start || b.end - a.end);
  const placed: (T & { lane: number; lanes: number })[] = [];
  let cluster: (T & { lane: number; lanes: number })[] = [];
  let clusterEnd = -1;
  const closeCluster = () => {
    const lanes = Math.max(0, ...cluster.map((item) => item.lane)) + 1;
    cluster.forEach((item) => (item.lanes = lanes));
    placed.push(...cluster);
    cluster = [];
  };
  for (const item of sorted) {
    if (item.start >= clusterEnd && cluster.length) closeCluster();
    const laneEnds = new Map<number, number>();
    cluster.forEach((other) =>
      laneEnds.set(
        other.lane,
        Math.max(laneEnds.get(other.lane) ?? 0, other.end),
      ),
    );
    let lane = 0;
    while ((laneEnds.get(lane) ?? -1) > item.start) lane += 1;
    cluster.push({ ...item, lane, lanes: 1 });
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  if (cluster.length) closeCluster();
  return placed;
}

const WEEKDAY_LONG = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export function dayAndMonth(day: string) {
  return `${dayNumber(day)} de ${MONTHS[Number(day.slice(5, 7)) - 1]}`;
}

export function weekdayAndYear(day: string) {
  return `${WEEKDAY_LONG[weekday(day)]}, ${day.slice(0, 4)}`;
}

export const SLOT_STEP_MINUTES = 30;

export type BookingRules = {
  today: string;
  lastDay: string;
  nowMinutes: number;
  openingMinutes: number;
  closingMinutes: number;
  workingDays: number[];
  busy: { startsAt: string; endsAt: string }[];
};

export function availableSlots(
  rules: BookingRules,
  day: string,
  duration: number,
) {
  if (
    day < rules.today ||
    day > rules.lastDay ||
    (rules.workingDays.length > 0 && !rules.workingDays.includes(weekday(day)))
  ) {
    return [];
  }
  const busy = rules.busy
    .filter((interval) => localDay(interval.startsAt) === day)
    .map((interval) => ({
      start: localMinutes(interval.startsAt),
      end: localMinutes(interval.endsAt) || 24 * 60,
    }));
  const slots: string[] = [];
  for (
    let start = rules.openingMinutes;
    start + duration <= rules.closingMinutes;
    start += SLOT_STEP_MINUTES
  ) {
    const end = start + duration;
    const past = day === rules.today && start <= rules.nowMinutes;
    const taken = busy.some(
      (interval) => start < interval.end && end > interval.start,
    );
    if (!past && !taken) slots.push(formatMinutes(start));
  }
  return slots;
}

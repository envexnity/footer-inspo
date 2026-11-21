export interface StudioClock {
  code: string;
  city: string;
  timeZone: string;
  formattedTime: string;
}

export const STUDIO_TIMEZONES: ReadonlyArray<{
  code: string;
  city: string;
  timeZone: string;
}> = [
  { code: 'ARG', city: 'Buenos Aires', timeZone: 'America/Argentina/Buenos_Aires' },
  { code: 'CET', city: 'Central Europe', timeZone: 'Europe/Madrid' },
  { code: 'WET', city: 'Western Europe', timeZone: 'Europe/Lisbon' },
];

/**
 * Formats a Date into an uppercase "HH:MM AM/PM" string for a given IANA timezone.
 */
export function formatClockEntry(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const parts = formatter.formatToParts(date);
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '12';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  const dayPeriod = (parts.find((p) => p.type === 'dayPeriod')?.value ?? 'AM').toUpperCase();

  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${dayPeriod}`;
}

/**
 * Returns formatted studio clock entries for ARG, CET, and WET.
 */
export function getStudioClocks(date: Date = new Date()): StudioClock[] {
  return STUDIO_TIMEZONES.map((tz) => ({
    code: tz.code,
    city: tz.city,
    timeZone: tz.timeZone,
    formattedTime: formatClockEntry(date, tz.timeZone),
  }));
}

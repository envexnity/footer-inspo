import test from 'node:test';
import assert from 'node:assert/strict';
import { formatClockEntry, getStudioClocks } from './timezones';

test('formatClockEntry formats UTC midnight into exact ARG, CET, and WET winter times', () => {
  // 2026-01-15T09:52:00Z -> ARG (UTC-3) = 06:52 AM, CET (UTC+1) = 10:52 AM, WET (UTC+0) = 09:52 AM
  const reference = new Date('2026-01-15T09:52:00.000Z');

  assert.equal(formatClockEntry(reference, 'America/Argentina/Buenos_Aires'), '06:52 AM');
  assert.equal(formatClockEntry(reference, 'Europe/Madrid'), '10:52 AM');
  assert.equal(formatClockEntry(reference, 'Europe/Lisbon'), '09:52 AM');
});

test('formatClockEntry handles PM hours with leading zero', () => {
  // 2026-01-15T18:05:00Z -> WET = 06:05 PM
  const reference = new Date('2026-01-15T18:05:00.000Z');
  assert.equal(formatClockEntry(reference, 'Europe/Lisbon'), '06:05 PM');
});

test('getStudioClocks returns ARG, CET, and WET entries in order', () => {
  const reference = new Date('2026-01-15T09:52:00.000Z');
  const clocks = getStudioClocks(reference);

  assert.equal(clocks.length, 3);
  assert.deepEqual(
    clocks.map((c) => `${c.code} ${c.formattedTime}`),
    ['ARG 06:52 AM', 'CET 10:52 AM', 'WET 09:52 AM']
  );
});

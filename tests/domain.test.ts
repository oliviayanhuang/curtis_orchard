import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  applyDateException,
  applyTodayOverride,
  buildPublicTodaySnapshot,
  evaluateSchedule,
  getBusinessDate,
  getEffectiveStatus,
  isOperationalDataStale,
  type DateException,
  type OperationalTarget,
  type ScheduleRule,
  type TodayOverride,
  // @ts-expect-error Node's type stripping requires the explicit .ts extension.
} from '../lib/domain.ts';

const activity: OperationalTarget = {
  targetType: 'activity',
  targetId: 'pony-rides',
};

const weekendSchedule: ScheduleRule = {
  id: 'pony-rides-fall-weekends',
  ...activity,
  startDate: '2026-09-05',
  endDate: '2026-11-01',
  daysOfWeek: [0, 6],
  openTime: '12:00',
  closeTime: '16:00',
  holidayMode: 'use_exception_list',
  enabled: true,
};

void describe('getBusinessDate', () => {
  void it('uses the Chicago date across UTC rollover in daylight time', () => {
    assert.equal(getBusinessDate('2026-09-07T04:59:59Z'), '2026-09-06');
    assert.equal(getBusinessDate('2026-09-07T05:00:00Z'), '2026-09-07');
  });

  void it('uses the Chicago date across UTC rollover in standard time', () => {
    assert.equal(getBusinessDate('2026-01-15T05:59:59Z'), '2026-01-14');
    assert.equal(getBusinessDate('2026-01-15T06:00:00Z'), '2026-01-15');
  });
});

void describe('evaluateSchedule', () => {
  void it('matches inclusive date ranges and JavaScript-style weekdays', () => {
    const firstSaturday = evaluateSchedule({
      target: activity,
      businessDate: '2026-09-05',
      at: '2026-09-05T18:00:00Z',
      rules: [weekendSchedule],
    });
    const sundayBeforeOpening = evaluateSchedule({
      target: activity,
      businessDate: '2026-09-06',
      at: '2026-09-06T16:59:00Z',
      rules: [weekendSchedule],
    });
    const weekday = evaluateSchedule({
      target: activity,
      businessDate: '2026-09-07',
      at: '2026-09-07T18:00:00Z',
      rules: [weekendSchedule],
    });
    const afterRange = evaluateSchedule({
      target: activity,
      businessDate: '2026-11-07',
      rules: [weekendSchedule],
    });

    assert.equal(firstSaturday.status, 'open');
    assert.equal(firstSaturday.scheduleRuleId, weekendSchedule.id);
    assert.equal(sundayBeforeOpening.status, 'opens_later');
    assert.equal(weekday.status, 'not_scheduled_today');
    assert.equal(afterRange.status, 'not_scheduled_today');
  });

  void it('ignores disabled and wrong-target rules', () => {
    const result = evaluateSchedule({
      target: activity,
      businessDate: '2026-09-06',
      rules: [
        { ...weekendSchedule, enabled: false },
        { ...weekendSchedule, targetId: 'wagon-rides' },
      ],
    });

    assert.equal(result.status, 'not_scheduled_today');
  });
});

void describe('effective status precedence', () => {
  const holidayException: DateException = {
    ...activity,
    businessDate: '2026-09-07',
    type: 'open_exception',
    openTime: '12:00',
    closeTime: '16:00',
    reason: 'Holiday schedule',
  };

  const weatherOverride: TodayOverride = {
    ...activity,
    businessDate: '2026-09-07',
    status: 'closed',
    reasonCode: 'weather',
    message: 'Closed due to weather.',
    createdAt: '2026-09-07T13:30:00-05:00',
    createdBy: 'staff-1',
  };

  void it('applies an exception after the schedule and an override last', () => {
    const scheduled = evaluateSchedule({
      target: activity,
      businessDate: '2026-09-07',
      at: '2026-09-07T19:00:00Z',
      rules: [weekendSchedule],
    });
    const excepted = applyDateException(scheduled, {
      exception: holidayException,
      at: '2026-09-07T19:00:00Z',
    });
    const overridden = applyTodayOverride(excepted, {
      override: weatherOverride,
    });

    assert.equal(scheduled.status, 'not_scheduled_today');
    assert.equal(excepted.status, 'open');
    assert.equal(excepted.source, 'date_exception');
    assert.equal(overridden.status, 'closed');
    assert.equal(overridden.source, 'today_override');
    assert.equal(overridden.reason, 'Weather');
    assert.equal(overridden.message, 'Closed due to weather.');
    assert.equal(overridden.effectiveFrom, weatherOverride.createdAt);
  });

  void it('resolves the complete pipeline and ignores records for another date', () => {
    const result = getEffectiveStatus({
      target: activity,
      at: '2026-09-07T19:00:00Z',
      rules: [weekendSchedule],
      exceptions: [
        { ...holidayException, businessDate: '2026-09-06' },
        holidayException,
      ],
      overrides: [
        { ...weatherOverride, businessDate: '2026-09-06' },
        weatherOverride,
      ],
    });

    assert.equal(result.businessDate, '2026-09-07');
    assert.equal(result.status, 'closed');
    assert.equal(result.source, 'today_override');
  });
});

void describe('buildPublicTodaySnapshot', () => {
  void it('builds the complete public shape and does not reuse input arrays', () => {
    const venues = [{ id: 'orchard-store', status: 'open' as const }];
    const activities = [{ id: 'pony-rides', status: 'open' as const }];

    const snapshot = buildPublicTodaySnapshot({
      businessDate: '2026-09-07',
      venues,
      activities,
      announcement: { message: 'Welcome to the orchard.' },
      publishedAt: '2026-09-07T14:42:18Z',
      publishedBy: 'staff-1',
      revisionId: 'revision-7',
    });

    assert.deepEqual(snapshot, {
      businessDate: '2026-09-07',
      venues,
      uPickApples: [],
      storeApples: [],
      activities,
      todayEvents: [],
      announcement: { message: 'Welcome to the orchard.' },
      publishedAt: '2026-09-07T14:42:18Z',
      publishedBy: 'staff-1',
      revisionId: 'revision-7',
    });
    assert.notEqual(snapshot.venues, venues);
    assert.notEqual(snapshot.activities, activities);
  });
});

void describe('isOperationalDataStale', () => {
  const now = '2026-09-07T18:00:00Z';
  const oneHour = 60 * 60 * 1000;

  void it('uses an exclusive max-age boundary', () => {
    assert.equal(
      isOperationalDataStale(
        {
          businessDate: '2026-09-07',
          publishedAt: '2026-09-07T17:00:00Z',
        },
        { now, maxAgeMs: oneHour },
      ),
      false,
    );
    assert.equal(
      isOperationalDataStale(
        {
          businessDate: '2026-09-07',
          publishedAt: '2026-09-07T16:59:59.999Z',
        },
        { now, maxAgeMs: oneHour },
      ),
      true,
    );
  });

  void it('treats another business date, missing metadata, and failed refreshes as stale', () => {
    assert.equal(
      isOperationalDataStale(
        {
          businessDate: '2026-09-06',
          publishedAt: '2026-09-07T17:59:00Z',
        },
        { now, maxAgeMs: oneHour },
      ),
      true,
    );
    assert.equal(isOperationalDataStale({}, { now, maxAgeMs: oneHour }), true);
    assert.equal(
      isOperationalDataStale(
        {
          businessDate: '2026-09-07',
          publishedAt: '2026-09-07T17:59:00Z',
        },
        { now, maxAgeMs: oneHour, refreshFailed: true },
      ),
      true,
    );
  });
});

export const BUSINESS_TIME_ZONE = 'America/Chicago';

export type BusinessDate = string;
export type LocalTime = string;
export type TimestampInput = Date | string | number;
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type OperationalStatus =
  | 'open'
  | 'closed'
  | 'opens_later'
  | 'temporarily_closed'
  | 'not_scheduled_today'
  | 'not_confirmed';

export type AvailabilityStatus =
  | 'available'
  | 'limited'
  | 'sold_out'
  | 'not_available'
  | 'not_in_season'
  | 'not_confirmed';

export type EffectiveStatusSource =
  | 'schedule'
  | 'date_exception'
  | 'today_override';

export interface OperationalTarget {
  targetId: string;
  /** Optional because the whitepaper's date-exception examples omit it. */
  targetType?: string;
}

export interface ScheduleRule extends OperationalTarget {
  id?: string;
  startDate: BusinessDate;
  endDate: BusinessDate;
  daysOfWeek: readonly DayOfWeek[];
  openTime?: LocalTime;
  closeTime?: LocalTime;
  holidayMode?: 'use_exception_list';
  /** Rules are enabled unless explicitly disabled. */
  enabled?: boolean;
}

interface DateExceptionBase extends OperationalTarget {
  businessDate: BusinessDate;
  reason?: string;
}

export interface OpenDateException extends DateExceptionBase {
  type: 'open_exception';
  openTime?: LocalTime;
  closeTime?: LocalTime;
}

export interface ClosedDateException extends DateExceptionBase {
  type: 'closed_exception';
}

export type DateException = OpenDateException | ClosedDateException;

export interface TodayOverride extends OperationalTarget {
  businessDate: BusinessDate;
  status: OperationalStatus;
  reasonCode?: string;
  message?: string;
  createdAt?: TimestampInput;
  createdBy?: string;
  /** Optional extension for an override such as "opens later." */
  openTime?: LocalTime;
  closeTime?: LocalTime;
}

export interface EffectiveStatus extends OperationalTarget {
  businessDate: BusinessDate;
  status: OperationalStatus;
  source: EffectiveStatusSource;
  openTime?: LocalTime;
  closeTime?: LocalTime;
  scheduleRuleId?: string;
  reason?: string;
  reasonCode?: string;
  message?: string;
  effectiveFrom?: string;
}

export interface EvaluateScheduleInput {
  target: OperationalTarget;
  businessDate: BusinessDate;
  rules: readonly ScheduleRule[];
  /** When supplied, opening hours also affect the returned status. */
  at?: TimestampInput;
}

export interface ApplyDateExceptionInput {
  exception?: DateException | null;
  /** Used to distinguish open, opens-later, and closed for timed exceptions. */
  at?: TimestampInput;
}

export interface ApplyTodayOverrideInput {
  override?: TodayOverride | null;
}

export interface GetEffectiveStatusInput {
  target: OperationalTarget;
  rules: readonly ScheduleRule[];
  /** At least one of businessDate or at must be supplied. */
  businessDate?: BusinessDate;
  at?: TimestampInput;
  exceptions?: readonly DateException[];
  overrides?: readonly TodayOverride[];
  /** A singular value takes priority over the corresponding collection. */
  dateException?: DateException | null;
  todayOverride?: TodayOverride | null;
}

export interface BuildPublicTodaySnapshotInput<
  TVenue = unknown,
  TUPickApple = unknown,
  TStoreApple = unknown,
  TActivity = unknown,
  TTodayEvent = unknown,
  TAnnouncement = Record<string, unknown>,
  TPublishedAt = string,
> {
  businessDate: BusinessDate;
  venues?: readonly TVenue[];
  uPickApples?: readonly TUPickApple[];
  storeApples?: readonly TStoreApple[];
  activities?: readonly TActivity[];
  todayEvents?: readonly TTodayEvent[];
  announcement?: TAnnouncement | null;
  publishedAt: TPublishedAt;
  publishedBy: string;
  revisionId: string;
}

export interface PublicTodaySnapshot<
  TVenue = unknown,
  TUPickApple = unknown,
  TStoreApple = unknown,
  TActivity = unknown,
  TTodayEvent = unknown,
  TAnnouncement = Record<string, unknown>,
  TPublishedAt = string,
> {
  businessDate: BusinessDate;
  venues: TVenue[];
  uPickApples: TUPickApple[];
  storeApples: TStoreApple[];
  activities: TActivity[];
  todayEvents: TTodayEvent[];
  announcement: TAnnouncement | null;
  publishedAt: TPublishedAt;
  publishedBy: string;
  revisionId: string;
}

export interface OperationalPublicationMetadata {
  businessDate?: BusinessDate | null;
  publishedAt?: TimestampInput | null;
}

export interface OperationalStalenessContext {
  now: TimestampInput;
  /** Product policy, supplied by the caller because the whitepaper sets no limit. */
  maxAgeMs: number;
  /** A failed refresh cannot be presented as verified live information. */
  refreshFailed?: boolean;
}

const businessDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BUSINESS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const businessTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BUSINESS_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function toDate(value: TimestampInput, label: string): Date {
  const date =
    value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (!Number.isFinite(date.getTime())) {
    throw new RangeError(`${label} must be a valid instant`);
  }

  return date;
}

function parseBusinessDate(value: BusinessDate): {
  year: number;
  month: number;
  day: number;
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new RangeError('businessDate must use YYYY-MM-DD');
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError('businessDate must be a real calendar date');
  }

  return { year, month, day };
}

function getBusinessWeekday(businessDate: BusinessDate): DayOfWeek {
  const { year, month, day } = parseBusinessDate(businessDate);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay() as DayOfWeek;
}

function getBusinessMinutes(
  at: TimestampInput,
  businessDate: BusinessDate,
): number {
  const date = toDate(at, 'at');

  if (getBusinessDate(date) !== businessDate) {
    throw new RangeError('at must fall on the requested Chicago businessDate');
  }

  const parts = businessTimeFormatter.formatToParts(date);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value);

  return hour * 60 + minute;
}

function parseLocalTime(value: LocalTime, label: string): number {
  const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.exec(value);

  if (!match) {
    throw new RangeError(`${label} must use 24-hour HH:mm`);
  }

  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function statusForWindow(
  openTime: LocalTime | undefined,
  closeTime: LocalTime | undefined,
  at: TimestampInput | undefined,
  businessDate: BusinessDate,
): OperationalStatus {
  if (openTime === undefined && closeTime === undefined) {
    return 'open';
  }

  if (openTime === undefined || closeTime === undefined) {
    throw new RangeError('openTime and closeTime must be provided together');
  }

  const opensAt = parseLocalTime(openTime, 'openTime');
  const closesAt = parseLocalTime(closeTime, 'closeTime');

  if (closesAt <= opensAt) {
    throw new RangeError(
      'closeTime must be later than openTime on the same day',
    );
  }

  if (at === undefined) {
    return 'open';
  }

  const currentMinutes = getBusinessMinutes(at, businessDate);

  if (currentMinutes < opensAt) {
    return 'opens_later';
  }

  return currentMinutes < closesAt ? 'open' : 'closed';
}

function sameTarget(
  left: OperationalTarget,
  right: OperationalTarget,
): boolean {
  return (
    left.targetId === right.targetId &&
    (left.targetType === undefined ||
      right.targetType === undefined ||
      left.targetType === right.targetType)
  );
}

function matchingRecord<
  T extends OperationalTarget & { businessDate: BusinessDate },
>(
  records: readonly T[] | undefined,
  target: OperationalTarget,
  businessDate: BusinessDate,
): T | undefined {
  let match: T | undefined;

  for (const record of records ?? []) {
    if (record.businessDate === businessDate && sameTarget(record, target)) {
      match = record;
    }
  }

  return match;
}

function humanizeReasonCode(
  reasonCode: string | undefined,
): string | undefined {
  if (!reasonCode) {
    return undefined;
  }

  return reasonCode
    .split('_')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}

function effectiveFrom(
  createdAt: TimestampInput | undefined,
): string | undefined {
  if (createdAt === undefined) {
    return undefined;
  }

  if (typeof createdAt === 'string') {
    toDate(createdAt, 'createdAt');
    return createdAt;
  }

  return toDate(createdAt, 'createdAt').toISOString();
}

/** Return the YYYY-MM-DD calendar date at Curtis Orchard for an exact instant. */
export function getBusinessDate(at: TimestampInput): BusinessDate {
  const parts = businessDateFormatter.formatToParts(toDate(at, 'at'));
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new RangeError('Unable to determine the Chicago business date');
  }

  return `${year}-${month}-${day}`;
}

/** Evaluate inclusive date ranges and JavaScript-style weekdays (Sunday = 0). */
export function evaluateSchedule(
  input: EvaluateScheduleInput,
): EffectiveStatus {
  const { target, businessDate, rules, at } = input;
  const weekday = getBusinessWeekday(businessDate);
  let matchingRule: ScheduleRule | undefined;

  for (const rule of rules) {
    if (rule.enabled === false || !sameTarget(rule, target)) {
      continue;
    }

    parseBusinessDate(rule.startDate);
    parseBusinessDate(rule.endDate);

    if (
      rule.startDate <= businessDate &&
      businessDate <= rule.endDate &&
      rule.daysOfWeek.includes(weekday)
    ) {
      matchingRule = rule;
      break;
    }
  }

  if (!matchingRule) {
    return {
      ...target,
      businessDate,
      status: 'not_scheduled_today',
      source: 'schedule',
    };
  }

  const status = statusForWindow(
    matchingRule.openTime,
    matchingRule.closeTime,
    at,
    businessDate,
  );

  return {
    ...target,
    businessDate,
    status,
    source: 'schedule',
    ...(matchingRule.openTime === undefined
      ? {}
      : { openTime: matchingRule.openTime }),
    ...(matchingRule.closeTime === undefined
      ? {}
      : { closeTime: matchingRule.closeTime }),
    ...(matchingRule.id === undefined
      ? {}
      : { scheduleRuleId: matchingRule.id }),
  };
}

/** Apply an explicitly configured exception only to its target and business date. */
export function applyDateException(
  current: EffectiveStatus,
  input: ApplyDateExceptionInput,
): EffectiveStatus {
  const { exception, at } = input;

  if (
    !exception ||
    exception.businessDate !== current.businessDate ||
    !sameTarget(exception, current)
  ) {
    return current;
  }

  const {
    openTime: _oldOpenTime,
    closeTime: _oldCloseTime,
    reason: _oldReason,
    reasonCode: _oldReasonCode,
    message: _oldMessage,
    effectiveFrom: _oldEffectiveFrom,
    ...base
  } = current;

  if (exception.type === 'closed_exception') {
    return {
      ...base,
      status: 'closed',
      source: 'date_exception',
      ...(exception.reason === undefined ? {} : { reason: exception.reason }),
    };
  }

  return {
    ...base,
    status: statusForWindow(
      exception.openTime,
      exception.closeTime,
      at,
      current.businessDate,
    ),
    source: 'date_exception',
    ...(exception.openTime === undefined
      ? {}
      : { openTime: exception.openTime }),
    ...(exception.closeTime === undefined
      ? {}
      : { closeTime: exception.closeTime }),
    ...(exception.reason === undefined ? {} : { reason: exception.reason }),
  };
}

/** Apply a matching same-day override after all schedule and exception logic. */
export function applyTodayOverride(
  current: EffectiveStatus,
  input: ApplyTodayOverrideInput,
): EffectiveStatus {
  const { override } = input;

  if (
    !override ||
    override.businessDate !== current.businessDate ||
    !sameTarget(override, current)
  ) {
    return current;
  }

  const {
    openTime: oldOpenTime,
    closeTime: oldCloseTime,
    reason: _oldReason,
    reasonCode: _oldReasonCode,
    message: _oldMessage,
    effectiveFrom: _oldEffectiveFrom,
    ...base
  } = current;
  const canHaveHours =
    override.status === 'open' || override.status === 'opens_later';
  const openTime =
    override.openTime ?? (canHaveHours ? oldOpenTime : undefined);
  const closeTime =
    override.closeTime ?? (canHaveHours ? oldCloseTime : undefined);
  const reason = humanizeReasonCode(override.reasonCode) ?? override.message;
  const startsAt = effectiveFrom(override.createdAt);

  return {
    ...base,
    status: override.status,
    source: 'today_override',
    ...(openTime === undefined ? {} : { openTime }),
    ...(closeTime === undefined ? {} : { closeTime }),
    ...(reason === undefined ? {} : { reason }),
    ...(override.reasonCode === undefined
      ? {}
      : { reasonCode: override.reasonCode }),
    ...(override.message === undefined ? {} : { message: override.message }),
    ...(startsAt === undefined ? {} : { effectiveFrom: startsAt }),
  };
}

/** Resolve schedule -> exact-date exception -> explicit today override. */
export function getEffectiveStatus(
  input: GetEffectiveStatusInput,
): EffectiveStatus {
  if (input.businessDate === undefined && input.at === undefined) {
    throw new TypeError('getEffectiveStatus requires businessDate or at');
  }

  const businessDate =
    input.businessDate ?? getBusinessDate(input.at as TimestampInput);
  parseBusinessDate(businessDate);

  const dateException =
    input.dateException !== undefined
      ? (input.dateException ?? undefined)
      : matchingRecord(input.exceptions, input.target, businessDate);
  const todayOverride =
    input.todayOverride !== undefined
      ? (input.todayOverride ?? undefined)
      : matchingRecord(input.overrides, input.target, businessDate);

  const scheduled = evaluateSchedule({
    target: input.target,
    businessDate,
    rules: input.rules,
    ...(input.at === undefined ? {} : { at: input.at }),
  });
  const excepted = applyDateException(scheduled, {
    exception: dateException,
    ...(input.at === undefined ? {} : { at: input.at }),
  });

  return applyTodayOverride(excepted, { override: todayOverride });
}

/** Build the single, derived public/today document without mutating authoring data. */
export function buildPublicTodaySnapshot<
  TVenue = unknown,
  TUPickApple = unknown,
  TStoreApple = unknown,
  TActivity = unknown,
  TTodayEvent = unknown,
  TAnnouncement = Record<string, unknown>,
  TPublishedAt = string,
>(
  input: BuildPublicTodaySnapshotInput<
    TVenue,
    TUPickApple,
    TStoreApple,
    TActivity,
    TTodayEvent,
    TAnnouncement,
    TPublishedAt
  >,
): PublicTodaySnapshot<
  TVenue,
  TUPickApple,
  TStoreApple,
  TActivity,
  TTodayEvent,
  TAnnouncement,
  TPublishedAt
> {
  parseBusinessDate(input.businessDate);

  return {
    businessDate: input.businessDate,
    venues: [...(input.venues ?? [])],
    uPickApples: [...(input.uPickApples ?? [])],
    storeApples: [...(input.storeApples ?? [])],
    activities: [...(input.activities ?? [])],
    todayEvents: [...(input.todayEvents ?? [])],
    announcement: input.announcement ?? null,
    publishedAt: input.publishedAt,
    publishedBy: input.publishedBy,
    revisionId: input.revisionId,
  };
}

/**
 * Mark data stale when it is unavailable, belongs to another Chicago business
 * date, could not be refreshed, or exceeds the caller's explicit age policy.
 */
export function isOperationalDataStale(
  metadata: OperationalPublicationMetadata,
  context: OperationalStalenessContext,
): boolean {
  if (!Number.isFinite(context.maxAgeMs) || context.maxAgeMs < 0) {
    throw new RangeError('maxAgeMs must be a finite, non-negative number');
  }

  if (
    context.refreshFailed ||
    !metadata.businessDate ||
    metadata.publishedAt == null
  ) {
    return true;
  }

  let now: Date;
  let publishedAt: Date;

  try {
    now = toDate(context.now, 'now');
    publishedAt = toDate(metadata.publishedAt, 'publishedAt');
    parseBusinessDate(metadata.businessDate);
  } catch {
    return true;
  }

  if (metadata.businessDate !== getBusinessDate(now)) {
    return true;
  }

  const ageMs = now.getTime() - publishedAt.getTime();
  return ageMs < 0 || ageMs > context.maxAgeMs;
}

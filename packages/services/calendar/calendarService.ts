import api from '../api/api';
import type {
  BlockedSlot,
  MonthlyAvailabilityData,
  MonthlyAvailabilityResponse,
} from '../../types/calendar';

const MONTHLY_AVAILABILITY_ENDPOINT = '/api/calendar/monthly-availability';

const isValidBlockedSlot = (value: unknown): value is BlockedSlot => {
  if (!value || typeof value !== 'object') return false;

  const slot = value as BlockedSlot;

  return (
    typeof slot.date === 'string' &&
    typeof slot.reason === 'string' &&
    (slot.start === undefined || typeof slot.start === 'string') &&
    (slot.end === undefined || typeof slot.end === 'string') &&
    (slot.fullDay === undefined || typeof slot.fullDay === 'boolean')
  );
};

const normalizeAvailabilityData = (
  clientId: string,
  year: number,
  month: number,
  payload?: Partial<MonthlyAvailabilityData> | null
): MonthlyAvailabilityData => ({
  clientId: payload?.clientId || clientId,
  year: payload?.year ?? year,
  month: payload?.month ?? month,
  blockedSlots: Array.isArray(payload?.blockedSlots)
    ? payload.blockedSlots.filter(isValidBlockedSlot)
    : [],
});

export async function getMonthlyAvailability(
  clientId: string,
  year: number,
  month: number
): Promise<MonthlyAvailabilityResponse> {
  try {
    // TODO: confirm backend route if monthly availability ships under a different path.
    const { data } = await api.get<MonthlyAvailabilityResponse & { data?: MonthlyAvailabilityData }>(
      MONTHLY_AVAILABILITY_ENDPOINT,
      {
        params: { clientId, year, month },
      }
    );

    const normalizedData = normalizeAvailabilityData(clientId, year, month, data?.data);

    return {
      success: data?.success ?? true,
      data: normalizedData,
      message: data?.message,
      error: data?.error,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to load monthly availability.';

    return {
      success: false,
      data: normalizeAvailabilityData(clientId, year, month, null),
      error: message,
    };
  }
}

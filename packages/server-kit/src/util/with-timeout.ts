export class DeadlineExceededError extends Error {
  constructor(ms: number) {
    super(`Deadline exceeded after ${ms}ms`);
    this.name = 'DeadlineExceededError';
  }
}

/** Races the asynchronous call against a deadline AND passes the deadline Date to the callee. */
export async function withTimeout<T>(
  call: (deadline: Date) => Promise<T>,
  ms: number
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const deadline = new Date(Date.now() + ms);

  try {
    return await Promise.race([
      call(deadline),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new DeadlineExceededError(ms)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function coarsenLocation(
  lat: number,
  lng: number,
  decimalPlaces = 3
): { lat: number; lng: number } {
  // ~110m privacy blurring for coordinates
  const factor = Math.pow(10, decimalPlaces);
  return {
    lat: Math.round(lat * factor) / factor,
    lng: Math.round(lng * factor) / factor,
  };
}

export function isPresent<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

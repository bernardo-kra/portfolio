export type ChatTimestamp =
  | string
  | number
  | Date
  | null
  | undefined
  | {
      seconds?: number
      _seconds?: number
      toDate?: () => Date
    }

export function chatDate(timestamp: ChatTimestamp): Date {
  let date: Date
  if (timestamp instanceof Date) date = timestamp
  else if (timestamp && typeof timestamp === 'object') {
    const seconds = timestamp.seconds ?? timestamp._seconds
    date =
      timestamp.toDate?.() ??
      new Date(typeof seconds === 'number' ? seconds * 1000 : 0)
  } else date = new Date(timestamp ?? 0)
  return Number.isFinite(date.getTime()) ? date : new Date(0)
}

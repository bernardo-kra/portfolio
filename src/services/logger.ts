// Browser logging adapter preserves the existing diagnostic arguments.
export const logger = {
  log: (...values: unknown[]) => console.log(...values),
  warn: (...values: unknown[]) => console.warn(...values),
  error: (...values: unknown[]) => console.error(...values),
}

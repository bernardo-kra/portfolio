// The backend's sole console boundary preserves the original level and arguments.
export const logger = {
  log: (...values: unknown[]) => console.log(...values),
  warn: (...values: unknown[]) => console.warn(...values),
  error: (...values: unknown[]) => console.error(...values),
};

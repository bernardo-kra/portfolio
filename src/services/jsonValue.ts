export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export async function readJson(response: Response): Promise<unknown> {
  return response.json()
}

export function parseJson(value: string): unknown {
  return JSON.parse(value)
}

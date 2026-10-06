export const validDocumentId = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length > 0 &&
  value.length <= 254 &&
  value !== '.' &&
  value !== '..' &&
  !value.includes('/') &&
  ![...value].some((character) => character.charCodeAt(0) < 32);

export const validText = (value: unknown, max: number): value is string =>
  typeof value === 'string' && !!value.trim() && value.length <= max;

const validUrl = (value: unknown): boolean => {
  if (value === '') return true;
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
};

// Reject unexpected fields instead of spreading request bodies into Firestore.
const invalidProjectField = Symbol('invalidProjectField');

function projectField(key: string, value: unknown) {
  if (key === 'title' || key === 'description') {
    if (!validText(value, key === 'title' ? 200 : 10000))
      return invalidProjectField;
    return value.trim();
  }
  if (key === 'technologies') {
    if (
      !Array.isArray(value) ||
      value.length > 30 ||
      !value.every((item) => validText(item, 80))
    )
      return invalidProjectField;
    return value.map((item) => item.trim());
  }
  return validUrl(value) ? value : invalidProjectField;
}

export function projectInput(
  body: unknown,
  partial = false
): Record<string, unknown> | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  const allowed = [
    'title',
    'description',
    'technologies',
    'githubUrl',
    'liveUrl',
    'imageUrl',
  ];
  if (
    Object.keys(input).some((key) => !allowed.includes(key)) ||
    !Object.keys(input).length
  )
    return null;
  if (
    !partial &&
    (!validText(input.title, 200) || !validText(input.description, 10000))
  )
    return null;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    const field = projectField(key, value);
    if (field === invalidProjectField) return null;
    result[key] = field;
  }
  return result;
}

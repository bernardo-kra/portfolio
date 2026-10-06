export function validReadMessageIds(
  ids: unknown,
  isChatOwner: boolean
): ids is string[] | undefined {
  if (ids === undefined) return isChatOwner;
  return (
    Array.isArray(ids) &&
    ids.length <= 100 &&
    !ids.some(
      (id: unknown) =>
        typeof id !== 'string' || !id || id.length > 200 || id.includes('/')
    )
  );
}

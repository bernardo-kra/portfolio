export function validLoginCredentials(
  email: string,
  password: unknown
): password is string {
  return (
    email.length <= 254 &&
    /^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(email) &&
    typeof password === 'string' &&
    !!password &&
    Buffer.byteLength(password, 'utf8') <= 72
  );
}

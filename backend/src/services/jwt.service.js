import crypto from 'node:crypto';

const ACCESS_TOKEN_TTL_SECONDS = 2 * 60 * 60;

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

export function signAccessToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }

  const now = Math.floor(Date.now() / 1000);

  const header = base64UrlEncode(JSON.stringify({
    alg: 'HS256',
    typ: 'JWT',
  }));

  const payload = base64UrlEncode(JSON.stringify({
    sub: String(user.id),
    maxId: String(user.maxId),
    iat: now,
    exp: now + ACCESS_TOKEN_TTL_SECONDS,
  }));

  const unsignedToken = `${header}.${payload}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(unsignedToken)
    .digest('base64url');

  return `${unsignedToken}.${signature}`;
}

export const ACCESS_TOKEN_TTL = ACCESS_TOKEN_TTL_SECONDS;

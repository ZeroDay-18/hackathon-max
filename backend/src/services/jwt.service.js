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

function decodeBase64Url(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
}

export function verifyAccessToken(token) {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed token');
  }

  const [encodedHeader, encodedPayload, receivedSignature] = parts;
  const header = decodeBase64Url(encodedHeader);

  if (header.alg !== 'HS256' || header.typ !== 'JWT') {
    throw new Error('Unsupported token');
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(receivedSignature);

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new Error('Invalid signature');
  }

  const payload = decodeBase64Url(encodedPayload);
  const userId = Number(payload.sub);

  if (!Number.isSafeInteger(userId) || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('Expired or malformed token');
  }

  return { userId, maxId: payload.maxId };
}

export const ACCESS_TOKEN_TTL = ACCESS_TOKEN_TTL_SECONDS;

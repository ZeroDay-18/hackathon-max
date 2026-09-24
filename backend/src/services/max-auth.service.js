import crypto from 'node:crypto'

const MAX_AUTH_MAX_AGE = 60 * 60 // 1 час

function parseInitData(initData) {
  if (!initData || typeof initData !== 'string') {
    throw new Error('initData is required')
  }

  const params = new URLSearchParams(initData)
  const entries = [...params.entries()]
  const keys = entries.map(([key]) => key)

  if (new Set(keys).size !== keys.length) {
    throw new Error('Duplicate initData parameter')
  }

  const hash = params.get('hash')

  if (!hash) {
    throw new Error('Missing hash')
  }

  const data = entries
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  return {
    params,
    data,
    hash,
  }
}

function verifyHash(data, receivedHash, botToken) {
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest()

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('hex')

  const expected = Buffer.from(calculatedHash, 'hex')
  const received = Buffer.from(receivedHash, 'hex')

  if (expected.length !== received.length) {
    return false
  }

  return crypto.timingSafeEqual(expected, received)
}

function parseJsonField(params, key) {
  const value = params.get(key)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function validateMaxInitData(initData, botToken) {
  const {
    params,
    data,
    hash,
  } = parseInitData(initData)

  if (!verifyHash(data, hash, botToken)) {
    throw new Error('Invalid MAX initData signature')
  }

  const authDate = Number(params.get('auth_date'))

  if (!Number.isFinite(authDate)) {
    throw new Error('Invalid auth_date')
  }

  const now = Math.floor(Date.now() / 1000)

  if (now - authDate > MAX_AUTH_MAX_AGE) {
    throw new Error('MAX initData expired')
  }

  if (authDate > now + 60) {
    throw new Error('MAX initData auth_date is in the future')
  }

  const result = Object.fromEntries(params.entries())

  result.user = parseJsonField(params, 'user')
  result.chat = parseJsonField(params, 'chat')

  return result
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const SENSITIVE_KEYS = ['password', 'token', 'access_token', 'refresh_token']

function redact(value) {
  if (!value || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(redact)
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, SENSITIVE_KEYS.includes(k) ? '***' : redact(v)])
  )
}

async function loggedFetch(url, options = {}) {
  const method = options.method ?? 'GET'
  options = { ...options, credentials: 'include' }
  const start = performance.now()
  const reqBody = options.body ? redact(JSON.parse(options.body)) : undefined
  console.log(`[API] → ${method} ${url}`, reqBody ?? '')

  try {
    const res = await fetch(url, options)
    const ms = Math.round(performance.now() - start)
    const resBody = await parseResponse(res.clone()).catch(() => undefined)
    const log = res.ok ? console.log : console.error
    log(`[API] ← ${method} ${url} ${res.status} (${ms}ms)`, redact(resBody) ?? '')
    return res
  } catch (err) {
    const ms = Math.round(performance.now() - start)
    console.error(`[API] ✕ ${method} ${url} failed (${ms}ms)`, err)
    throw err
  }
}

// Auth tokens live in HttpOnly cookies set by the backend; JS never sees them.
// The backend also sets a readable `csrf_token` cookie that we echo back in a header.
const CSRF_COOKIE = 'csrf_token'
const CSRF_HEADER = 'X-CSRF-Token'

function getCookie(name) {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

function authHeaders(method = 'GET') {
  const csrf = method === 'GET' ? null : getCookie(CSRF_COOKIE)
  return {
    'Content-Type': 'application/json',
    ...(csrf ? { [CSRF_HEADER]: csrf } : {}),
  }
}

let refreshPromise = null

export function refreshToken() {
  // Share one in-flight refresh between concurrent requests that hit an expired token.
  refreshPromise ??= (async () => {
    const res = await loggedFetch(`${BASE_URL}/api/users/refresh-token`, {
      method: 'POST',
      headers: authHeaders('POST'),
    })
    if (!res.ok) throw new Error('Session expired. Please sign in again.')
    const data = await parseResponse(res)
    if (data?.user_categories) localStorage.setItem('categories', JSON.stringify(data.user_categories))
  })().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

export async function logout() {
  try {
    await loggedFetch(`${BASE_URL}/api/users/logout`, {
      method: 'POST',
      headers: authHeaders('POST'),
    })
  } finally {
    localStorage.removeItem('categories')
  }
}

export async function hasSession() {
  try {
    await get('/api/users/profile/')
    return true
  } catch {
    return false
  }
}

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') ?? ''
  return contentType.includes('application/json') ? res.json() : res.text()
}

async function handleResponse(res, retry) {
  if (!res.ok) {
    const body = await parseResponse(res)
    const code = body?.detail ?? body?.error_code ?? ''
    if (code === 'Invalid or expired token' && retry) {
      await refreshToken()
      return retry()
    }
    throw new Error(body?.message ?? body ?? `HTTP ${res.status}`)
  }
  return parseResponse(res)
}

export async function get(path, params) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v)
    })
  }
  const doRequest = () =>
    loggedFetch(url.toString(), { method: 'GET', headers: authHeaders('GET') })

  const res = await doRequest()
  return handleResponse(res, async () => {
    const retried = await doRequest()
    return handleResponse(retried, null)
  })
}

export async function post(path, body) {
  const doRequest = () =>
    loggedFetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: authHeaders('POST'),
      body: JSON.stringify(body),
    })

  const res = await doRequest()
  return handleResponse(res, async () => {
    const retried = await doRequest()
    return handleResponse(retried, null)
  })
}

export async function put(path, body) {
  const doRequest = () =>
    loggedFetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: authHeaders('PUT'),
      body: JSON.stringify(body),
    })

  const res = await doRequest()
  return handleResponse(res, async () => {
    const retried = await doRequest()
    return handleResponse(retried, null)
  })
}

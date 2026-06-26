const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token')
  const res = await fetch(`${BASE_URL}/api/users/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  })
  if (!res.ok) throw new Error('Session expired. Please sign in again.')
  const data = await res.json()
  localStorage.setItem('token', data.access_token)
  if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token)
if (data.user_categories) localStorage.setItem('categories', JSON.stringify(data.user_categories))
  return data.token
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
    fetch(url.toString(), { method: 'GET', headers: authHeaders() })

  const res = await doRequest()
  return handleResponse(res, async () => {
    const retried = await doRequest()
    return handleResponse(retried, null)
  })
}

export async function post(path, body) {
  const doRequest = () =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: authHeaders(),
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
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    })

  const res = await doRequest()
  return handleResponse(res, async () => {
    const retried = await doRequest()
    return handleResponse(retried, null)
  })
}

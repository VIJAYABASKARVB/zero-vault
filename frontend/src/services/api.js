const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(endpoint, { token, method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed (${res.status})`)
  }

  return res.json()
}

export function getEncryptionConfig(token) {
  return request('/user/encryption', { token })
}

export function setupEncryption(token, data) {
  return request('/user/encryption', { token, method: 'PUT', body: data })
}

export function fetchEntries(token) {
  return request('/vault', { token })
}

export function createEntry(token, data) {
  return request('/vault', { token, method: 'POST', body: data })
}

export function updateEntry(token, entryId, data) {
  return request(`/vault/${entryId}`, { token, method: 'PUT', body: data })
}

export function deleteEntry(token, entryId) {
  return request(`/vault/${entryId}`, { token, method: 'DELETE' })
}
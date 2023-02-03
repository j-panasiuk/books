const headers = {
  'Content-Type': 'application/json',
}

export const request = {
  get: (endpoint: string, params?: RequestInit) =>
    send(endpoint, {
      method: 'GET',
      headers,
      ...params,
    }),
  post: (endpoint: string, payload: unknown, params?: RequestInit) =>
    send(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      ...params,
    }),
  put: (endpoint: string, payload: unknown, params?: RequestInit) =>
    send(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
      ...params,
    }),
  patch: (endpoint: string, payload: unknown, params?: RequestInit) =>
    send(endpoint, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload),
      ...params,
    }),
  delete: (endpoint: string, params?: RequestInit) =>
    send(endpoint, {
      method: 'DELETE',
      headers,
      ...params,
    }),
} as const

async function send(endpoint: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(endpoint, init)
  if (!res.ok) throw await res.json()
  return res.json()
}
